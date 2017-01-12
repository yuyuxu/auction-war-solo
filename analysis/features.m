% REASSIGN the preprocessed data matrices
D = D_;
X = X_;
Xr = Xr_;
y_mach = y_mach_;
y_svo = y_svo_;

% =========================================================================
% -- FILTERS
% according to turker specific information
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
% action sequence starting with action 1 (0, 0, 0)?
% also remove last reward less than 4.0?
invalid_action_indices = [];
n = size(X, 1);
for i = 1:n
  l = length(X{i, 1});
  if l < 3 ||...
     X{i, 1}(1, 1) == 1 || ...
     Xr{i, 1}(l, 1) < 5.0
    invalid_action_indices = [invalid_action_indices, i];
  end
end
D(invalid_action_indices, :) = [];
X(invalid_action_indices, :) = [];
Xr(invalid_action_indices, :) = [];
y_mach(invalid_action_indices, :) = [];
y_svo(invalid_action_indices, :) = [];

% -- SELECTS
% select according to turker information
selected_demo = [];
n = size(X, 1);
for i = 1:n
  % strcmp(D{i, 9}, 'Graduate degree (Masters/ Doctorate/ etc.)') == 0 good
  % strcmp(D{i, 9}, 'Bachelors degree') == 0
  % strcmp(D{i, 10}, 'Male') == 0
  % strcmp(D{i, 11}, 'Asian') == 0 good
  % strcmp(D{i, 12}, 'Hispanic') == 0 good
  % str2double(D{i, 8}) > 50 || str2double(D{i, 8}) <= 25 || 
  % strcmp(D{i, 8}, 'NA') == 1 || strcmp(D{i, 8}, '{}') == 1
  if ...
  strcmp(D{i, 9}, 'Graduate degree (Masters/ Doctorate/ etc.)') == 1 || ...
  str2double(D{i, 8}) > 50 || ...
  strcmp(D{i, 11}, 'Asian') == 1
    selected_demo = [selected_demo, i];
  end
end
D = D(selected_demo, :);
X = X(selected_demo, :);
Xr = Xr(selected_demo, :);
y_mach = y_mach(selected_demo, :);
y_svo = y_svo(selected_demo, :);
toc;

% -- OTHER INFO
% -- extract sequence that has reject accepts
n = size(X, 1);
Xra = cell(n, 1);
for i = 1:n
  l = length(X{i, 1});
  Xra{i, 1} = zeros(l, 1);
  for j = 1:l
    agent_reward_offered = 16.4 - reward_index(X{i, 1}(j, 1));
    if (agent_reward_offered - agent_rewards(1, j)) > 0.00001 && ...
       j ~= l
      fprintf('player %d rejected the accept from agent at turn %d\n', i, j + 1);
      Xra{i, 1}(j, 1) = 1;
    end
  end
end
toc

% =========================================================================
% -- manual feature engineering
n = size(X, 1);
sequence_len = zeros(n, 1);
final_reward = zeros(n, 1);
first_reward = zeros(n, 1);
first_final_diff = zeros(n, 1);
num_counter_offer = zeros(n, 1);
repeated_offer = zeros(n, 1);
num_peaks = zeros(n, 1);
num_vallies = zeros(n, 1);
reward_eff = zeros(n, 1);
action_frequency = zeros(n, 24);
for i = 1:n
  len = length(X{i, 1});
  sequence_len(i, 1) = len;
  
  % first / final / reward and their diff
  first_action = X{i, 1}(1, 1);
  last_action = X{i, 1}(len, 1);
  for j = 1:3
    first_reward(i, 1) = first_reward(i, 1) + ...
      item_rewards(1, j) * action_index(first_action, j) * num_items(1, j);
    final_reward(i, 1) = final_reward(i, 1) + ...
      item_rewards(1, j) * action_index(last_action, j) * num_items(1, j);
  end
  first_final_diff(i, 1) = first_reward(i, 1) - final_reward(i, 1);
  
  % count offers
  for j = 1:len
    % num_counter_offer
    aid = X{i, 1}(j, 1);
    reward = 16.4 - ...
      (item_rewards(1, 1) * action_index(aid, 1) * num_items(1, 1) + ...
      item_rewards(1, 2) * action_index(aid, 2) * num_items(1, 2) + ...
      item_rewards(1, 3) * action_index(aid, 3) * num_items(1, 3));
    if reward > agent_rewards(1, j)
      num_counter_offer(i, 1) = num_counter_offer(i, 1) + 1;
    end
    
    % repeated offer
    if (j > 1) && (X{i, 1}(j, 1) == X{i, 1}(j - 1, 1))
      repeated_offer(i, 1) = repeated_offer(i, 1) + 1;
    end
    
    % action frequency
    action_frequency(i, aid) = action_frequency(i, aid) + 1;
    
    % number of changies
    if j > 1 && j < len
      if X{i, 1}(j, 1) > X{i, 1}(j - 1, 1) && ...
         X{i, 1}(j, 1) > X{i, 1}(j + 1, 1)
        num_peaks(i, 1) = num_peaks(i, 1) + 1;
      end
      if X{i, 1}(j, 1) < X{i, 1}(j - 1, 1) && ...
         X{i, 1}(j, 1) < X{i, 1}(j + 1, 1)
        num_vallies(i, 1) = num_vallies(i, 1) + 1;
      end
    end
    
    % eff
    reward_eff(i, 1) = reward_eff(i, 1) + Xr{i, 1}(j, 1);
  end
  reward_eff(i, 1) = reward_eff(i, 1) / len;
end
% figure;
% histogram(sequence_len);

% categorize labels
y_svo(y_svo == 2) = 1;
y_svo(y_svo == 3) = 0;
y_mach_c = zeros(size(y_mach, 1), 1);
y_mach_c(y_mach > mach_thresh) = 1;
length(find(y_mach_c == 1))
length(find(y_mach_c == 0))

X_all = [sequence_len, ...
final_reward, ...
first_reward, ...
first_final_diff, ...
num_counter_offer, ...
repeated_offer, ...
num_peaks, ...
num_vallies, ...
reward_eff, ...
];

% =========================================================================
