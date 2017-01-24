close all;
warning off;

% -- Plot: demographic information
% figure;
% subplot(2, 2, 1);
% histogram(categorical(D(1:end, 8)));
% subplot(2, 2, 2);
% histogram(categorical(D(1:end, 9)));
% subplot(2, 2, 3);
% histogram(categorical(D(1:end, 10)));
% subplot(2, 2, 4);
% histogram(str2double(D(1:end, 7)));

% -- Plot: labels
% figure;
% subplot(1, 2, 1);
% histogram(y_mach);
% subplot(1, 2, 2);
% histogram(y_svo);

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
% analysis_linear(all_features, y_mach, 'quadratic');

% -- Model: y_svo ~ sequence len
% analysis_logistic(sequence_len, y_svo);
% analysis_svm(sequence_len, y_svo);
% -- Model: y_svo ~ final reward
% analysis_logistic(final_reward, y_svo);
% analysis_svm(final_reward, y_svo);
% -- Model: y_svo ~ first reward
% analysis_logistic(first_reward, y_svo);

% -- Model: y_svo ~ first reward
% analysis_svm(first_reward, y_svo);
% -- Model: y_svo ~ all features
% analysis_svm(all_features, y_svo);

% -- HMM: observation is actual action
% data = X;
% for i = 1:size(X, 1)
%   data{i} = data{i}';
% end
% analysis_hmm_discrete(data, 3, 24, 2);

% -- HMM: observation is rewards
% prepare data
data = cell(size(Xr, 1), 1);
for i = 1:size(Xr, 1)
  data{i} = Xr{i, 1}';
end

% analysis on the whole dataset
% analysis_hmm_continuous(data, 5, 1, -1);

% carve up the data into small groups according to mach
% analysis_hmm_continuous(data(y_mach_bin == 0, :), 5, 1, -1);
% analysis_hmm_continuous(data(y_mach_bin == 1, :), 5, 1, -1);

% carve up the data into small groups according to svo
% analysis_hmm_continuous(data(y_svo_bin == 0, :), 5, 1, -1);
% analysis_hmm_continuous(data(y_svo_bin == 1, :), 5, 1, -1);

% carve up the data into small groups according to age
% below 28, 29 - 50, above 50
% ages = str2double(D(1:end, 8));
% analysis_hmm_continuous(data(ages < 28, :), 5, 1, -1);
% analysis_hmm_continuous(data(ages >= 28 & ages < 45, :), 5, 1, -1);
% analysis_hmm_continuous(data(ages >= 45, :), 5, 1, -1);

% carve up the data into small groups according to gender
% n = size(D, 1);
% gender = zeros(n, 1);
% for i = 1:n
%   if strcmp(D{i, 10}, 'Female') == 1
%     gender(i, 1) = 1;
%   end
% end
% analysis_hmm_continuous(data(gender == 0, :), 5, 1, -1);
% analysis_hmm_continuous(data(gender == 1, :), 5, 1, -1);

% carve up the data into small groups according to education
% n = size(D, 1);
% education = zeros(n, 1);
% for i = 1:n
%   if strcmp(D{i, 9}, 'Bachelors degree') == 1
%     education(i, 1) = 1;
%   elseif strcmp(D{i, 9}, 'Graduate degree (Masters/ Doctorate/ etc.)') == 1
%     education(i, 1) = 2;
%   elseif strcmp(D{i, 9}, 'select one') == 1
%     education(i, 1) = 3;
%   end
% end
% analysis_hmm_continuous(data(education == 0, :), 5, 1, -1);
% analysis_hmm_continuous(data(education == 1, :), 5, 1, -1);
% analysis_hmm_continuous(data(education == 2, :), 5, 1, -1);

% carve up the data into small groups according to background
% n = size(D, 1);
% background = zeros(n, 1);
% for i = 1:n
%   if strcmp(D{i, 11}, 'Caucasian') == 1
%     background(i, 1) = 1;
%   elseif strcmp(D{i, 11}, 'Hispanic') == 1
%     background(i, 1) = 2;
%   elseif strcmp(D{i, 11}, 'African American') == 1
%     background(i, 1) = 3;
%   elseif strcmp(D{i, 11}, 'Others') == 1
%     background(i, 1) = 4;
%   end
% end
% analysis_hmm_continuous(data(background == 0, :), 5, 1, -1);
% analysis_hmm_continuous(data(background == 1, :), 5, 1, -1);
% analysis_hmm_continuous(data(background == 2, :), 5, 1, -1);
% analysis_hmm_continuous(data(background == 3, :), 5, 1, -1);

% -- HMM/Markov: obs is rewards, and categorized into different ranks
data_cat = cell(size(Xr, 1), 1);
for i = 1:n
  l = length(X{i, 1});
  reward = zeros(l, 1);
  for j = 1:l
    if Xr{i, 1}(j, 1) < 6.1
      reward(j, 1) = 1;
    elseif Xr{i, 1}(j, 1) >= 6.1 && Xr{i, 1}(j, 1) <= 8.1
      reward(j, 1) = 2;
    elseif Xr{i, 1}(j, 1) == 8.2
      reward(j, 1) = 3;
    elseif Xr{i, 1}(j, 1) >= 8.3 && Xr{i, 1}(j, 1) <= 10.3
      reward(j, 1) = 4;
    elseif Xr{i, 1}(j, 1) > 10.3
      reward(j, 1) = 5;
    end
  end
  data_cat{i} = reward';
end
print_label = '[0,6.1) [6.1,8.1] [8.2] [8.3,10.3] (10.3,16.4]';

% hidden markov
% analysis_hmm_discrete(data_cat, 3, 3, -1);
% analysis_hmm_discrete(data_cat(y_mach_bin == 0, :), 3, 3, -1);
% analysis_hmm_discrete(data_cat(y_mach_bin == 1, :), 3, 3, -1);

% markov on whole dataset
% analysis_markov(data_cat, 5, print_label, print_label);

% carve up the data into small groups according to mach
% [C1, ~] = analysis_markov(data_cat(y_mach_bin == 0, :), 5, print_label, print_label);
% [C2, ~] = analysis_markov(data_cat(y_mach_bin == 1, :), 5, print_label, print_label);
% analysis_compare_markov(C1, C2);

% carve up the data into small groups according to svo
% [C1, ~] = analysis_markov(data_cat(y_svo_bin == 0, :), 5, print_label, print_label);
% [C2, ~] = analysis_markov(data_cat(y_svo_bin == 1, :), 5, print_label, print_label);
% analysis_compare_markov(C1, C2);

% carve up the data into small groups according to age
% below 28, 29 - 50, above 50
% ages = str2double(D(1:end, 8));
% [C1, ~] = analysis_markov(data_cat(ages < 28, :), 5, print_label, print_label);
% [C2, ~] = analysis_markov(data_cat(ages >= 28 & ages < 45, :), 5, print_label, print_label);
% [C3, ~] = analysis_markov(data_cat(ages >= 45, :), 5, print_label, print_label);
% analysis_compare_markov(C1, C2);
% analysis_compare_markov(C2, C3);
% analysis_compare_markov(C1, C3);

% carve up the data into small groups according to gender
% n = size(D, 1);
% gender = zeros(n, 1);
% for i = 1:n
%   if strcmp(D{i, 10}, 'Female') == 1
%     gender(i, 1) = 1;
%   end
% end
% [C1, ~] = analysis_markov(data_cat(gender == 0, :), 5, print_label, print_label);
% [C2, ~] = analysis_markov(data_cat(gender == 1, :), 5, print_label, print_label);
% analysis_compare_markov(C1, C2);

% carve up the data into small groups according to education
% n = size(D, 1);
% education = zeros(n, 1);
% for i = 1:n
%   if strcmp(D{i, 9}, 'Bachelors degree') == 1
%     education(i, 1) = 1;
%   elseif strcmp(D{i, 9}, 'Graduate degree (Masters/ Doctorate/ etc.)') == 1
%     education(i, 1) = 2;
%   elseif strcmp(D{i, 9}, 'select one') == 1
%     education(i, 1) = 3;
%   end
% end
% [C1, ~] = analysis_markov(data_cat(education == 0, :), 5, print_label, print_label);
% [C2, ~] = analysis_markov(data_cat(education == 1, :), 5, print_label, print_label);
% [C3, ~] = analysis_markov(data_cat(education == 2, :), 5, print_label, print_label);
% analysis_compare_markov(C1, C2);
% analysis_compare_markov(C2, C3);
% analysis_compare_markov(C1, C3);

% carve up the data into small groups according to starting offer range
% n = size(D, 1);
% starting_offer = zeros(n, 1);
% for i = 1:n
%   if Xr{i, 1}(1, 1) < 8.1
%     starting_offer(i, 1) = 1;
%   elseif Xr{i, 1}(1, 1) >= 8.1 &&  Xr{i, 1}(1, 1) <= 8.3
%     starting_offer(i, 1) = 2;
%   elseif Xr{i, 1}(1, 1) > 8.3
%     starting_offer(i, 1) = 3;
%   end
% end
% [C1, ~] = analysis_markov(data_cat(starting_offer == 1, :), 5, print_label, print_label);
% [C2, ~] = analysis_markov(data_cat(starting_offer == 2, :), 5, print_label, print_label);
% [C3, ~] = analysis_markov(data_cat(starting_offer == 3, :), 5, print_label, print_label);
% analysis_compare_markov(C1, C2);
% analysis_compare_markov(C2, C3);
% analysis_compare_markov(C1, C3);

% carve up the data into small groups according to whether the diff between
% first and last offer is positive or negative
% n = size(D, 1);
% diff_first_last_offer = zeros(n, 1);
% for i = 1:n
%   l = length(Xr{i, 1});
%   if Xr{i, 1}(1, 1) < Xr{i, 1}(l, 1)
%     diff_first_last_offer(i, 1) = 1;
%   elseif Xr{i, 1}(1, 1) > Xr{i, 1}(l, 1)
%     diff_first_last_offer(i, 1) = 2;
%   end
% end
% [C1, ~] = analysis_markov(data_cat(diff_first_last_offer == 1, :), 5, print_label, print_label);
% [C2, ~] = analysis_markov(data_cat(diff_first_last_offer == 2, :), 5, print_label, print_label);
% analysis_compare_markov(C1, C2);