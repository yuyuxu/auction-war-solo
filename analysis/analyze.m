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
% 
% data1 = cell(size(Xr, 1), 1);
% for i = 1:size(Xr, 1)
%   data1{i} = [Xr{i, 1}'; Xra{i, 1}'];
%   % data1{i} = Xr{i, 1}';
% end
% [prior1, transmat1, mu1, Sigma1, mixmat1, paths] = ...
%   analysis_hmm1(data1, y_mach_c, 2, Q, O, plot_data_index);