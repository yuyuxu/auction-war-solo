clear;
clc;
close all;

config;

if save_data == 1

% -- LOADING: loading mturk data
n1 = 32;
M1 = csv2cell('data/Batch1_.csv', 'fromfile');
M2 = csv2cell('data/Batch2_.csv', 'fromfile');
M3 = csv2cell('data/Batch3_.csv', 'fromfile');
M4 = csv2cell('data/Batch4_.csv', 'fromfile');
M5 = csv2cell('data/Batch5_.csv', 'fromfile');
M = [M1(2:end, :); M2(2:end, :); M3(2:end, :); M4(2:end, :); M5(2:end, :)];
col_needed = [16, 28, 29, 30, 31, 32];
M = M(:, col_needed);

% -- LOADING: loading dynamo db data
n2 = 6;
A1 = csv2cell('data/auction-war-solo-users1.csv', 'fromfile');
A2 = csv2cell('data/auction-war-solo-users2.csv', 'fromfile');
A3 = csv2cell('data/auction-war-solo-users3.csv', 'fromfile');
A4 = csv2cell('data/auction-war-solo-users4.csv', 'fromfile');
A = [A1(2:end, :); A2(2:end, :); A3(2:end, :); A4(2:end, :)];

% -- PREPROCESSING: clean data mturk
% trim mturk data worker id (possibly has space inside)
M(1:end, :) = strtrim(M(1:end, :));
% remove duplicates in mturk data
[tmp, unique_id1] = unique(M(1:end, 1), 'first');
dup_id1 = find(not(ismember(1:numel(M(1:end, 1)), unique_id1)));
M = M(unique_id1, :);
% remove people without game reward code
unfinished = strmatch('{}', M(1:end, 6));
M(unfinished, :) = [];

% -- PREPROCESSING: clean data amazon dynamo db
% remove non finished user
unfinished = strmatch('*', A(1:end, 5), 'exact');
A(unfinished, :) = [];
% trim dynamo data worker id (possibly has space inside)
A(1:end, :) = strtrim(A(1:end, :));
% check if there's duplicate in dynamo data (shouldn't be any)
[tmp, unique_id2] = unique(A(1:end, 1), 'first');
dup_id2 = find(not(ismember(1:numel(A(1:end, 1)), unique_id2)));
if (~isempty(dup_id2))
  error('dynamodb data should not have duplicates');
end

% -- PREPROCESSING: find mapping and concatenate worker information
%   create centralized input cell matrix
% final input data
D = cell(size(A, 1), (size(A, 2) + size(M, 2) - 2));
unmapped = [];
for i = 1:size(A, 1)
  mapped = find(ismember(M(1:end, 6), A{i, 5}));
  if isempty(mapped)
    unmapped = [unmapped, i];
    % diagnose to see what might be the issue
    tmp = find(ismember(M(1:end, 1), A{i, 1}));
    if (isempty(tmp))
      fprintf('both id (%s) and reward (%s) cannot be matched \n', ...
        (A{i, 1}), (A{i, 5}));
    else
      fprintf('id (%s) is found, reward (%s) is not matching %s \n', ...
        (A{i, 1}), (A{i, 5}), (M{tmp, 6}));
    end
    continue;
  end
  D(i, 1:n2) = A(i, :);
  D(i, n2 + 1:end) = M(mapped, 2:end - 1);
end
D(unmapped, :) = [];

% -- PROCESSING: simple plot of demographic information
% figure;
% subplot(2, 2, 1);
% histogram(categorical(D(1:end, 8)));
% subplot(2, 2, 2);
% histogram(categorical(D(1:end, 9)));
% subplot(2, 2, 3);
% histogram(categorical(D(1:end, 10)));
% subplot(2, 2, 4);
% histogram(str2double(D(1:end, 7)));

% -- PROCESSING: extracting label
n = size(D, 1);
y_mach = zeros(n, 1);
mach_keys = ['T+', 'V-', 'V+', 'T-', 'V+', 'T+', 'V+', 'M+', 'V-', ...
  'T+', 'V+', 'T-', 'V-', 'V-', 'T-', 'T-', 'V+', 'T+', 'T-', 'M-'];
y_svo = zeros(n, 1);
y_svo_angle = zeros(n, 1);
svo_s = [100	98	96	94	93	91	89	87	85; ...
         100	94	88	81	75	69	63	56	50; ...
         50	54	59	63	68	72	76	81	85; ...
         50	54	59	63	68	72	76	81	85; ...
         85	87	89	91	93	94	96	98	100; ...
         85	85	85	85	85	85	85	85	85];
svo_o = [50	54	59	63	68	72	76	81	85; ...
         50	56	63	69	75	81	88	94	100; ...
         100	89	79	68	58	47	36	26	15; ...
         100	98	96	94	93	91	89	87	85; ...
         15	19	24	28	33	37	41	46	50; ...
         85	76	68	59	50	41	33	24	15];
for i = 1:n
  qstr = JSON.parse(D{i, 3});
  % mach
  j = 1;
  mach_score = zeros(length(fieldnames(qstr.s0)), 1);
  for fields = fieldnames(qstr.s0)'
    selected = qstr.s0.(fields{1});
    score = 0;
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
  y_svo_angle(i, 1) = angle;
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

% figure;
% subplot(1, 2, 1);
% histogram(y_mach);
% subplot(1, 2, 2);
% histogram(y_svo);

% -- PROCESSING: extracting features
% 24 moving action, 1 accept, total 25 actions
% NOTE: JSON.parse has trouble parsing double type, so here using jsonlab
n = size(D, 1);
X = cell(n, 1);
for i = 1:n
  gamedata = JSON.parse(D{i, 2});
  X{i, 1} = zeros(size(gamedata, 2) ,1);
  for j = 1:size(gamedata, 2)  
    stepstr = gamedata{1, j};
    % to use jsonlab, need to strip character '/' off stepstr
    stepstr = strrep(stepstr, '\', '');
    step = loadjson(stepstr);
    if strcmp(step.action, 'accept') == 1
      X{i, 1}(j, 1) = 25;
    elseif strcmp(step.action, 'submit') == 1
      count = [0, 0, 0];
      k = 1;
      for fields = fieldnames(step.params{1, 1})'
        selected = step.params{1, 1}.(fields{1});
        count(1, k) = length(find(selected == 2));
        k = k + 1;
      end
      % compute the action index
      X{i, 1}(j, 1) = 2 * count(1, 1) + 3 * count(1, 2) + ...
                      4 * count(1, 3);
    else
      error('action not valid');
    end
  end
end

save('temp/D.mat', 'D');
save('temp/y_mach.mat', 'y_mach');
save('temp/y_svo.mat', 'y_svo');
save('temp/X.mat', 'X');

else % end of save_data

load('temp/D.mat');
load('temp/y_mach.mat');
load('temp/y_svo.mat');
load('temp/X.mat');
end % otherwise load data
