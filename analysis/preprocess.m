clear;
clc;
close all;

parameters;

% -- LOADING: loading mturk data
M1 = csv2cell('data/Batch1_.csv', 'fromfile');
M2 = csv2cell('data/Batch2_.csv', 'fromfile');
M3 = csv2cell('data/Batch3_.csv', 'fromfile');
M4 = csv2cell('data/Batch4_.csv', 'fromfile');
M5 = csv2cell('data/Batch5_.csv', 'fromfile');
% first row is column names
M = [M1(2:end, :); M2(2:end, :); M3(2:end, :); M4(2:end, :); M5(2:end, :)];
col_needed = [16, 24, 28, 29, 30, 31, 32];
M = M(:, col_needed);

% -- LOADING: loading dynamo db data
A1 = csv2cell('data/auction-war-solo-users1.csv', 'fromfile');
A2 = csv2cell('data/auction-war-solo-users2.csv', 'fromfile');
A3 = csv2cell('data/auction-war-solo-users3.csv', 'fromfile');
A4 = csv2cell('data/auction-war-solo-users4.csv', 'fromfile');
% first row is column names
A = [A1(2:end, :); A2(2:end, :); A3(2:end, :); A4(2:end, :)];

% -- PREPROCESSING: clean mturk data
% trim mturk data worker id (possibly has space inside)
M(1:end, :) = strtrim(M(1:end, :));
% remove people without game reward code
unfinished = strmatch('{}', M(1:end, 6));
M(unfinished, :) = [];
% remove duplicates in mturk data
[tmp, unique_id1] = unique(M(1:end, 1), 'first');
dup_id1 = find(not(ismember(1:numel(M(1:end, 1)), unique_id1)));
M = M(unique_id1, :);

% -- PREPROCESSING: clean data amazon dynamo db
% trim dynamo data worker id (possibly has space inside)
A(1:end, :) = strtrim(A(1:end, :));
% remove non finished user
unfinished = strmatch('*', A(1:end, 5), 'exact');
A(unfinished, :) = [];
% check if there's duplicate in dynamo data (shouldn't be any)
[tmp, unique_id2] = unique(A(1:end, 1), 'first');
dup_id2 = find(not(ismember(1:numel(A(1:end, 1)), unique_id2)));
if (~isempty(dup_id2))
  error('dynamodb data should not have duplicates');
end

% -- PREPROCESSING: find mapping and concatenate worker information
% create centralized input cell matrix
% final input data
D = cell(size(A, 1), (size(A, 2) + size(M, 2) - 2));
unmapped = [];
for i = 1:size(A, 1)
  mapped = find(ismember(M(1:end, 7), A{i, 5}));
  if isempty(mapped)
    unmapped = [unmapped, i];
    % diagnose to see what might be the issue
    tmp = find(ismember(M(1:end, 1), A{i, 1}));
    if (isempty(tmp))
      fprintf('both id (%s) and reward (%s) cannot be matched \n', ...
        (A{i, 1}), (A{i, 5}));
    else
      fprintf('id (%s) is found, reward (%s) is not matching %s \n', ...
        (A{i, 1}), (A{i, 5}), (M{tmp, 7}));
    end
    continue;
  end
  D(i, 1:6) = A(i, :);
  D(i, 7:end) = M(mapped, 2:end - 1);
end
% remove data that has incorrect mapping
D(unmapped, :) = [];

% -- PROCESSING: extracting label
% final number of data points
n = size(D, 1);
% labels
y_mach = zeros(n, 1);
y_svo = zeros(n, 1);
for i = 1:n
  qstr = JSON.parse(D{i, 3});
  % mach
  j = 1;
  mach_score = zeros(length(fieldnames(qstr.s0)), 1);
  for fields = fieldnames(qstr.s0)'
    selected = qstr.s0.(fields{1});
    if strcmp(selected, 'strongly disagree') == 1
      score = 1;
    elseif strcmp(selected, 'disagree') == 1
      score = 2;
    elseif strcmp(selected, 'neutral') == 1
      score = 3;
    elseif strcmp(selected, 'agree') == 1
      score = 4;
    elseif strcmp(selected, 'strongly agree') == 1
      score = 5;
    else
      error('selected is not valid');
    end
    if strcmp(mach_keys(j * 2 - 1), 'T') == 1
      if strcmp(mach_keys(j * 2), '+') == 1
        mach_score(j, 1) = score;
      elseif strcmp(mach_keys(j * 2), '-') == 1
        mach_score(j, 1) = 6 - score;
      else
        error('mach key reverse not valid');
      end
    elseif strcmp(mach_keys(j * 2 - 1), 'M') == 1
      if strcmp(mach_keys(j * 2), '+') == 1
        mach_score(j, 2) = score;
      elseif strcmp(mach_keys(j * 2), '-') == 1
        mach_score(j, 2) = 6 - score;
      else
        error('mach key reverse not valid');
      end
    elseif strcmp(mach_keys(j * 2 - 1), 'V') == 1
      if strcmp(mach_keys(j * 2), '+') == 1
        mach_score(j, 3) = score;
      elseif strcmp(mach_keys(j * 2), '-') == 1
        mach_score(j, 3) = 6 - score;
      else
        error('mach key reverse not valid');
      end
    else
      error('mach key type is not valid');
    end
    j = j + 1;
  end
  y_mach(i, 1) = sum(mach_score(:));
  
  % svo
  j = 1;
  svo_score_s = zeros(length(fieldnames(qstr.s1)), 1);
  svo_score_o = zeros(length(fieldnames(qstr.s1)), 1);
  for fields = fieldnames(qstr.s1)'
    selected = qstr.s1.(fields{1});
    svo_score_s(j, 1) = svo_s(j, str2double(selected));
    svo_score_o(j, 1) = svo_o(j, str2double(selected));
    j = j + 1;
  end
  avg_s = mean(svo_score_s);
  avg_o = mean(svo_score_o);
  angle = atand((avg_o - 50.0) / (avg_s - 50.0));
  if angle > 57.15
    y_svo(i, 1) = 1; % altruist
  elseif angle <= 57.15 && angle > 22.45
    y_svo(i, 1) = 2; % prosocials
  elseif angle <= 22.45 && angle > -12.04
    y_svo(i, 1) = 3; % indivisualists
  else
    y_svo(i, 1) = 4; % competitive
  end
end

% -- PROCESSING: extracting raw data
% 24 moving action, 1 accept, total 25 actions
% longest sequence should only contain 9 actions
% NOTE: JSON.parse has trouble parsing double type, so here using jsonlab
n = size(D, 1);
X = cell(n, 1);
for i = 1:n
  gamedata = JSON.parse(D{i, 2});
  X{i, 1} = zeros(size(gamedata, 2) ,1);
  for j = 1:size(gamedata, 2)  
    stepstr = gamedata{1, j};
    % to use jsonlab, need to strip character '\' off stepstr
    stepstr = strrep(stepstr, '\', '');
    step = loadjson(stepstr);
    if strcmp(step.action, 'accept') == 1
      X{i, 1}(j, 1) = 25;
    elseif strcmp(step.action, 'submit') == 1
      % get item count and find action index
      count = [0, 0, 0];
      k = 1;
      for fields = fieldnames(step.params{1, 1})'
        selected = step.params{1, 1}.(fields{1});
        count(1, k) = length(find(selected == 2));
        k = k + 1;
      end
      % find action index
      X{i, 1}(j, 1) = find(ismember(action_index, count, 'rows'));
    else
      error('action not valid');
    end
  end
end

spent_times = zeros(n, 1);
for i = 1:n
  spent_times(i, 1) = str2double(D{i, 7});
end

unwanted_demographic_indices = [];
for i = 1:n
  % strcmp(D{i, 9}, 'Graduate degree (Masters/ Doctorate/ etc.)') == 0 good
  % strcmp(D{i, 9}, 'Bachelors degree') == 0
  % strcmp(D{i, 10}, 'Male') == 0
  % strcmp(D{i, 11}, 'Asian') == 0 good
  % strcmp(D{i, 12}, 'Hispanic') == 0 good
  % str2double(D{i, 8}) > 50 || str2double(D{i, 8}) <= 25 || strcmp(D{i, 8}, 'NA') == 1 || strcmp(D{i, 8}, '{}') == 1
  if str2double(D{i, 7}) < 500
   unwanted_demographic_indices = [unwanted_demographic_indices, i];
  end
end
D(unwanted_demographic_indices, :) = [];
X(unwanted_demographic_indices, :) = [];
y_mach(unwanted_demographic_indices, :) = [];
y_svo(unwanted_demographic_indices, :) = [];

% -- PROCESSING: Cleanup features and labels
% remove action 25 and 10th action
n = size(X, 1);
for i = 1:n
  l = length(X{i, 1});
  if X{i, 1}(l, 1) == 25
    X{i, 1} = X{i, 1}(1:end-1, 1);
  end
  l = length(X{i, 1});
  if l == 10
    X{i, 1} = X{i, 1}(1:end-1, 1);
  end
end

% remove action sequence starting with action 1 (0, 0, 0) or less than 3
invalid_action_indices = [];
for i = 1:n
  if length(X{i, 1}) < 3 || X{i, 1}(1, 1) == 1
    invalid_action_indices = [invalid_action_indices, i];
  end
end
X(invalid_action_indices, :) = [];
y_mach(invalid_action_indices, :) = [];
y_svo(invalid_action_indices, :) = [];

% For SVO, only has class 2 and 3 at this point, make them binary
y_svo(y_svo == 2) = 1;
y_svo(y_svo == 3) = 0;