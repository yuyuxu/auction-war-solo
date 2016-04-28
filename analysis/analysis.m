clc;
close all;

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

% -- try different type of features
n = size(X, 1);
sequence_len = zeros(n, 1);
final_reward = zeros(n, 1);
first_reward = zeros(n, 1);
num_counter_offer = zeros(n, 1);
action_frequency = zeros(n, 24);
for i = 1:n
  len = length(X{i, 1});
  sequence_len(i, 1) = len;
  first_action = X{i, 1}(1, 1);
  last_action = X{i, 1}(len, 1);
  for j = 1:3
    first_reward(i, 1) = first_reward(i, 1) + ...
      item_rewards(1, j) * action_index(first_action, j) * num_items(1, j);
    final_reward(i, 1) = final_reward(i, 1) + ...
      item_rewards(1, j) * action_index(last_action, j) * num_items(1, j);
  end
end
% figure;
% histogram(sequence_len);

% -- Model: y_mach ~ sequence len
% analysis_linear(sequence_len, y_mach, 'purequadratic');
% -- Model: y_svo ~ sequence len
% analysis_logistic(sequence_len, y_svo);
% analysis_svm(sequence_len, y_svo);
% -- Model: y_mach ~ final reward
% analysis_linear(final_reward, y_mach, 'linear');
% -- Model: y_svo ~ final reward
% analysis_logistic(final_reward, y_svo);
% analysis_svm(final_reward, y_svo);
% -- Model: y_mach ~ first reward
% analysis_linear(first_reward, y_mach, 'purequadratic');
% -- Model: y_svo ~ first reward
% analysis_logistic(first_reward, y_svo);
% analysis_svm(first_reward, y_svo);

analysis_linear([sequence_len, first_reward, final_reward], y_mach, 'interactions');
