clear;
clc;
close all;

parameters;
tic;
% -- LOADING: loading mturk data
% collection 1
M1 = csv2cell('data/Batch1_.csv', 'fromfile');
M2 = csv2cell('data/Batch2_.csv', 'fromfile');
M3 = csv2cell('data/Batch3_.csv', 'fromfile');
M4 = csv2cell('data/Batch4_.csv', 'fromfile');
M5 = csv2cell('data/Batch5_.csv', 'fromfile');
% collection 2
M6 = csv2cell('data/Batch6_.csv', 'fromfile');
M7 = csv2cell('data/Batch7_.csv', 'fromfile');
M8 = csv2cell('data/Batch8_.csv', 'fromfile');
M9 = csv2cell('data/Batch9_.csv', 'fromfile');
% first row is column names
M = [M1(2:end, :); M2(2:end, :); M3(2:end, :); ...
     M4(2:end, :); M5(2:end, :); M6(2:end, :); ...
     M7(2:end, :); M8(2:end, :); M9(2:end, :)];
col_needed = [16, 24, 28, 29, 30, 31, 32];
M = M(:, col_needed);

% -- LOADING: loading dynamo db data
A1 = csv2cell('data/auction-war-solo-users1.csv', 'fromfile');
A2 = csv2cell('data/auction-war-solo-users2.csv', 'fromfile');
A3 = csv2cell('data/auction-war-solo-users3.csv', 'fromfile');
A4 = csv2cell('data/auction-war-solo-users4.csv', 'fromfile');
A5 = csv2cell('data/auction-war-solo-users5.csv', 'fromfile');
% first row is column names
A = [A1(2:end, :); A2(2:end, :); A3(2:end, :); A4(2:end, :); A5(2:end, :)];
toc;

% -- PREPROCESSING: clean mturk data
% trim mturk data worker id (possibly has space inside)
M(1:end, :) = strtrim(M(1:end, :));
% remove people without game reward code
unfinished = strmatch('{}', M(1:end, 7));
M(unfinished, :) = [];
% remove duplicates in mturk data
[~, unique_id1] = unique(M(1:end, 1), 'first');
dup_id1 = find(not(ismember(1:numel(M(1:end, 1)), unique_id1)));
M = M(unique_id1, :);

% -- PREPROCESSING: clean data amazon dynamo db
% trim dynamo data worker id (possibly has space inside)
A(1:end, :) = strtrim(A(1:end, :));
% remove non finished user
unfinished = strmatch('*', A(1:end, 5), 'exact');
A(unfinished, :) = [];
% check if there's duplicate in dynamo data (shouldn't be any)
[~, unique_id2] = unique(A(1:end, 1), 'first');
dup_id2 = find(not(ismember(1:numel(A(1:end, 1)), unique_id2)));
if (~isempty(dup_id2))
  warning('dynamodb data have duplicates %d \n', size(dup_id2, 2));
end
A = A(unique_id2, :);

% -- PREPROCESSING: find mapping and concatenate worker information
D = cell(size(A, 1), (size(A, 2) + size(M, 2) - 2));
unmapped = []; 
for i = 1:size(A, 1) 
  mapped_reward = find(ismember(M(1:end, 7), A{i, 5}));
  if isempty(mapped_reward)
    % diagnose to see what might be the issue
    mapped_id = find(ismember(M(1:end, 1), A{i, 1}));
    if isempty(mapped_id)
      fprintf('both id (%s) and reward (%s) cannot be matched \n', ...
        (A{i, 1}), (A{i, 5}));
      unmapped = [unmapped, i];
    else
      fprintf('id (%s) is found, reward (%s) is not matching, M id is: %s, reward is: %s \n', ...
        (A{i, 1}), (A{i, 5}), (M{mapped_id, 1}), (M{mapped_id, 7}));
      D(i, 1:6) = A(i, :);
      D(i, 7:end) = M(mapped_id, 2:end - 1);
    end
  else
    if strcmp(M{mapped_reward, 1}, A{i, 1}) == 0
      fprintf('reward (%s) matched, but id cannot be matched, M id: %s, A id: %s \n', (A{i, 5}), (M{mapped_reward, 1}), (A{i, 1}));
    end
    D(i, 1:6) = A(i, :);
    D(i, 7:end) = M(mapped_reward, 2:end - 1);
  end
end
% remove data that has incorrect mapping
D(unmapped, :) = [];
toc;

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

% -- PROCESSING: extracting raw feature
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

% -- PROCESSING: extract actual features
% remove 10th action
% replace action 25 with the actual items
n = size(X, 1);
for i = 1:n
  l = length(X{i, 1});
  if l == 10
    X{i, 1} = X{i, 1}(1:end-1, 1);
  end
  l = length(X{i, 1});
  if X{i, 1}(l, 1) == 25
    X{i, 1}(l, 1) = agent_actions_r(1, l - 1);
  end
  agent_reward_offered = 16.4 - reward_index(X{i, 1}(l, 1));
  if (agent_reward_offered < agent_rewards(1, l)) < -0.00001 && ...
     l ~= 9
    fprintf('player %d final action error\n', i);
  end
end
% reward sequence
Xr = cell(n, 1);
for i = 1:n
  l = length(X{i, 1});
  Xr{i, 1} = zeros(l, 1);
  for j = 1:l
    Xr{i, 1}(j, 1) = reward_index(X{i, 1}(j, 1));
  end
end
toc;
