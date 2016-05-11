clc;
close all;
warning off;

% -- plot demographic information
% figure;
% subplot(2, 2, 1);
% histogram(categorical(D(1:end, 8)));
% subplot(2, 2, 2);
% histogram(categorical(D(1:end, 9)));
% subplot(2, 2, 3);
% histogram(categorical(D(1:end, 10)));
% subplot(2, 2, 4);
% histogram(str2double(D(1:end, 7)));

% -- plot labels
% figure;
% subplot(1, 2, 1);
% histogram(y_mach);
% subplot(1, 2, 2);
% histogram(y_svo);

% =========================================================================
% -- extracting features
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

% -- Model: y_mach ~ sequence len
% analysis_linear(sequence_len, y_mach, 'purequadratic');
% -- Model: y_mach ~ final reward
% analysis_linear(final_reward, y_mach, 'linear');
% -- Model: y_mach ~ first reward
% analysis_linear(first_reward, y_mach, 'purequadratic');
% -- Model: y_mach ~ num_counter_offer
% analysis_linear(num_counter_offer, y_mach, 'purequadratic');
% -- Model: y_mach ~ repeated_offer
% analysis_linear(repeated_offer, y_mach, 'purequadratic');
% -- Model: y_mach ~ all features
% analysis_linear(X_all, y_mach, 'quadratic');


% -- Model: y_svo ~ sequence len
% analysis_logistic(sequence_len, y_svo);
% analysis_svm(sequence_len, y_svo);
% -- Model: y_svo ~ final reward
% analysis_logistic(final_reward, y_svo);
% analysis_svm(final_reward, y_svo);
% -- Model: y_svo ~ first reward
% analysis_logistic(first_reward, y_svo);
% analysis_svm(first_reward, y_svo);
% -- Model: y_svo ~ action frequency
% analysis_logistic_lasso(action_frequency, y_svo);
% analysis_svm(action_frequency, y_svo);
% analysis_svm(X_all, y_svo);


% -- HMM: observation is action index/rewards
% assemble data for HMM
% data = X;
% for i = 1:size(X, 1)
%   data{i} = data{i}';
% end
% analysis_hmm(data, y_mach_c, 2, Q, O, plot_data_index);

data1 = cell(size(Xr, 1), 1);
for i = 1:size(Xr, 1)
  % data1{i} = [Xr{i, 1}'; Xra{i, 1}'];
  data1{i} = Xr{i, 1}';
end
[prior1, transmat1, mu1, Sigma1, mixmat1, paths] = ...
  analysis_hmm1(data1, y_mach_c, 2, Q, O, plot_data_index);