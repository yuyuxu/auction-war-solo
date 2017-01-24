% -- REASSIGN the preprocessed data matrices
D = D_;
X = X_;
Xr = Xr_;
y_mach = y_mach_;
y_svo = y_svo_;


% =========================================================================
% -- FILTERS
% according to turker specific information
n = size(X, 1);
unwanted_stats = [];
for i = 1:n
  if str2double(D{i, 7}) < 400
   unwanted_stats = [unwanted_stats, i];
  end
end
D(unwanted_stats, :) = [];
X(unwanted_stats, :) = [];
Xr(unwanted_stats, :) = [];
y_mach(unwanted_stats, :) = [];
y_svo(unwanted_stats, :) = [];

% sequence length less than 3
% also remove last reward less than 4.0
% action sequence starting with action 1 (0, 0, 0)?
invalid_action_indices = [];
n = size(X, 1);
for i = 1:n
  l = length(X{i, 1});
  if l < 3 || Xr{i, 1}(l, 1) < 4.0 %|| X{i, 1}(1, 1) == 1
    invalid_action_indices = [invalid_action_indices, i];
  end
end
D(invalid_action_indices, :) = [];
X(invalid_action_indices, :) = [];
Xr(invalid_action_indices, :) = [];
y_mach(invalid_action_indices, :) = [];
y_svo(invalid_action_indices, :) = [];


% =========================================================================
% -- SELECTS, SLICE DATA
% selected_demo = [];
% n = size(X, 1);
% for i = 1:n
%   % strcmp(D{i, 9}, 'Graduate degree (Masters/ Doctorate/ etc.)') == 0 good
%   % strcmp(D{i, 9}, 'Bachelors degree') == 0
%   % strcmp(D{i, 10}, 'Male') == 0
%   % strcmp(D{i, 11}, 'Asian') == 0 good
%   % strcmp(D{i, 12}, 'Hispanic') == 0 good
%   % str2double(D{i, 8}) > 50 || str2double(D{i, 8}) <= 25 || 
%   % strcmp(D{i, 8}, 'NA') == 1 || strcmp(D{i, 8}, '{}') == 1
%   if ...
%   strcmp(D{i, 9}, 'Graduate degree (Masters/ Doctorate/ etc.)') == 1 || ...
%   str2double(D{i, 8}) > 50 || ...
%   strcmp(D{i, 11}, 'Asian') == 1
%     selected_demo = [selected_demo, i];
%   end
% end
% D = D(selected_demo, :);
% X = X(selected_demo, :);
% Xr = Xr(selected_demo, :);
% y_mach = y_mach(selected_demo, :);
% y_svo = y_svo(selected_demo, :);


% =========================================================================
% -- HAND PICK FEATURES
n = size(X, 1);
% extract sequence that has rejected accepts
Xra = cell(n, 1);
for i = 1:n
  l = length(X{i, 1});
  Xra{i, 1} = zeros(l, 1);
  for j = 1:l
    agent_reward_offered = 16.4 - reward_index(X{i, 1}(j, 1));
    if (agent_reward_offered - agent_rewards(1, j)) > 0.00001 && ...
       j ~= l
      % fprintf('player %d rejected the accept from agent at turn %d\n', i, j + 1);
      Xra{i, 1}(j, 1) = 1;
    end
  end
end

% features
sequence_len = zeros(n, 1);
first_reward = zeros(n, 1);
final_reward = zeros(n, 1);
avg_reward = zeros(n, 1);

num_counter_offer = zeros(n, 1);
num_repeated_offer = zeros(n, 1);
num_peak = zeros(n, 1);
num_valley = zeros(n, 1);
ratio_counter_offer = zeros(n, 1);
ratio_repeated_offer = zeros(n, 1);
ratio_peak = zeros(n, 1);
ratio_valley = zeros(n, 1);

study_time = zeros(n, 1);

for i = 1:n
  len = length(X{i, 1});
  
  sequence_len(i, 1) = len;
  first_reward(i, 1) = Xr{i, 1}(1, 1);
  final_reward(i, 1) = Xr{i, 1}(len, 1);
  avg_reward(i, 1) = mean(Xr{i, 1});
  
  num_counter_offer(i, 1) = sum(Xra{i, 1});
  ratio_counter_offer(i, 1) = num_counter_offer(i, 1) / double(len);
  for j = 1:len  
    if (j > 1) && (X{i, 1}(j, 1) == X{i, 1}(j - 1, 1))
      num_repeated_offer(i, 1) = num_repeated_offer(i, 1) + 1;
    end
    if j > 1 && j < len
      if X{i, 1}(j, 1) > X{i, 1}(j - 1, 1) && ...
         X{i, 1}(j, 1) > X{i, 1}(j + 1, 1)
        num_peak(i, 1) = num_peak(i, 1) + 1;
      end
      if X{i, 1}(j, 1) < X{i, 1}(j - 1, 1) && ...
         X{i, 1}(j, 1) < X{i, 1}(j + 1, 1)
        num_valley(i, 1) = num_valley(i, 1) + 1;
      end
    end
  end
  ratio_repeated_offer(i, 1) = num_repeated_offer(i, 1) / double(len);
  ratio_peak(i, 1) = num_peak(i, 1) / double(len);
  ratio_valley(i, 1) = num_valley(i, 1) / double(len);
  
  study_time(i, 1) = str2double(D{i, 7});
end

all_features = [sequence_len, first_reward, final_reward, avg_reward, ...
  ratio_counter_offer, ratio_repeated_offer, ratio_peak, ratio_valley, ...
  study_time];
for i = 1:size(all_features, 1)
  all_features(i, :) = standardize(all_features(i, :));
end

% =========================================================================
% -- LABELS
y_svo_bin = zeros(size(y_svo, 1), 1);
y_svo_bin(y_svo == 2) = 1;
y_svo_bin(y_svo == 3) = 0;
y_mach_bin = zeros(size(y_mach, 1), 1);
y_mach_bin(y_mach > 58.2642) = 1;