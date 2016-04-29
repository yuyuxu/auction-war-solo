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

% -- extracting features
n = size(X, 1);
sequence_len = zeros(n, 1);
final_reward = zeros(n, 1);
first_reward = zeros(n, 1);
num_counter_offer = zeros(n, 1);
repeated_offer = zeros(n, 1);
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
  end
end
% figure;
% histogram(sequence_len);

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
X_all = [first_reward, final_reward, ...
         num_counter_offer, repeated_offer];
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


% -- HMM: observation is action index, hidden states 1
O = 24;
Q = 3;

% training data
data = X;
for i = 1:size(X, 1)
  data{i} = data{i}';
end

% % initial guess of parameters
% prior1 = normalise(rand(Q,1));
% transmat1 = mk_stochastic(rand(Q,Q));
% obsmat1 = mk_stochastic(rand(Q,O));
% 
% % improve guess of parameters using EM
% [LL, prior2, transmat2, obsmat2] = ...
%   dhmm_em(data, prior1, transmat1, obsmat1, 'max_iter', 100);
% 
% % use model to compute log likelihood
% loglik = dhmm_logprob(data, prior2, transmat2, obsmat2);
% % log lik is slightly different than LL(end), since it is computed after the final M step
% 
% % the path of one data
% one_data = data{4, :};
% B = multinomial_prob(one_data, obsmat2);
% path = viterbi_path(prior2, transmat2, B);
% figure;
% hold on;
% plot(path, 'bo-');
% plot(one_data, 'r*-');
% % ylim([-0.1, 24.1]);
% xlim([0, 10]);
% hold off;

% k = 10;
% indices = crossvalind('Kfold', n, k);
% mach_thresh1 = 65;
% mach_thresh2 = 55;
% err_vec = zeros(k, 1);
% for i = 1:k
%   testidx = (indices == i);
%   trainidx = ~testidx;
% 
%   % data for high mach and low mach
%   train_data_x = data(trainidx, :);
%   test_data_x = data(testidx, :);
%   train_data_y = y_mach(trainidx, :);
%   test_data_y = y_mach(testidx, :);
%   indices1 = find(train_data_y > mach_thresh1);
%   indices2 = find(train_data_y <= mach_thresh1 & train_data_y > mach_thresh2);
%   indices3 = find(train_data_y <= mach_thresh2);
%   train_data1 = train_data_x(indices1, :);
%   train_data2 = train_data_x(indices2, :);
%   train_data3 = train_data_x(indices3, :);
%   test_data_y(test_data_y > mach_thresh1) = 2;
%   test_data_y(test_data_y <= mach_thresh1 & test_data_y > mach_thresh2) = 1;
%   test_data_y(test_data_y <= mach_thresh2 & test_data_y ~= 1 & test_data_y ~= 2) = 0;
% 
%   % initial guess of parameters
%   prior0 = normalise(rand(Q,1));
%   transmat0 = mk_stochastic(rand(Q,Q));
%   obsmat0 = mk_stochastic(rand(Q,O));
%   
%   % train high mach
%   [LL1, prior1, transmat1, obsmat1] = ...
%     dhmm_em(train_data1, prior0, transmat0, obsmat0, 'max_iter', 100);
%   % train med mach
%   [LL2, prior2, transmat2, obsmat2] = ...
%     dhmm_em(train_data2, prior0, transmat0, obsmat0, 'max_iter', 100);
%   [LL2, prior3, transmat3, obsmat3] = ...
%     dhmm_em(train_data3, prior0, transmat0, obsmat0, 'max_iter', 100);
% 
%   % yhats
%   yhat = zeros(size(test_data_y, 1), 1);
%   countdiff = 0.0;
%   for j = 1:size(test_data_y, 1)
%   [loglik1, errors1] = dhmm_logprob(test_data_x(j, 1), prior1, transmat1, obsmat1);
%   [loglik2, errors2] = dhmm_logprob(test_data_x(j, 1), prior2, transmat2, obsmat2);
%   [loglik3, errors3] = dhmm_logprob(test_data_x(j, 1), prior3, transmat3, obsmat3);
%   if (loglik1 >= loglik2 && loglik1 >= loglik3)
%     yhat(j, 1) = 2;
%   elseif (loglik2 >= loglik3 && loglik2 >= loglik1)
%     yhat(j, 1) = 1;
%   elseif (loglik3 >= loglik1 && loglik3 >= loglik2)
%     yhat(j, 1) = 0;
%   end
%   if yhat(j, 1) ~= test_data_y(j, 1)
%     countdiff = countdiff + 1;
%   end
%   end
%   err_vec(i, 1) = countdiff / size(yhat, 1);
% end
% mean(err_vec)


% HMM interpretation
% initial guess of parameters
prior0 = normalise(rand(Q,1));
transmat0 = mk_stochastic(rand(Q,Q));
obsmat0 = mk_stochastic(rand(Q,O));
indices1 = find(y_mach > mach_thresh);
indices2 = find(y_mach <= mach_thresh);
% improve guess of parameters using EM
[LL, prior1, transmat1, obsmat1] = ...
  dhmm_em(data(indices1, :), prior0, transmat0, obsmat0, 'max_iter', 100);
[LL, prior2, transmat2, obsmat2] = ...
  dhmm_em(data(indices1, :), prior0, transmat0, obsmat0, 'max_iter', 100);
one_data_id = 79;
one_data = data{one_data_id, :};
if y_mach(one_data_id) == 1
B = multinomial_prob(one_data, obsmat1);
path = viterbi_path(prior1, transmat1, B);
else
B = multinomial_prob(one_data, obsmat2);
path = viterbi_path(prior2, transmat2, B);
end
figure;
hold on;
plot(path, 'bo-');
plot(one_data, 'r*-');
% ylim([-0.1, 24.1]);
xlim([0, 10]);
hold off;


% HMM classification
k = 10;
indices = crossvalind('Kfold', n, k);
err_vec = zeros(k, 1);
for i = 1:k
  testidx = (indices == i);
  trainidx = ~testidx;

  % data for high mach and low mach
  train_data_x = data(trainidx, :);
  test_data_x = data(testidx, :);
  train_data_y = y_mach(trainidx, :);
  test_data_y = y_mach(testidx, :);
  indices1 = find(train_data_y > mach_thresh);
  indices2 = find(train_data_y <= mach_thresh);
  train_data1 = train_data_x(indices1, :);
  train_data2 = train_data_x(indices2, :);
  test_data_y(test_data_y > mach_thresh) = 1;
  test_data_y(test_data_y <= mach_thresh) = 0;

  % initial guess of parameters
  prior0 = normalise(rand(Q,1));
  transmat0 = mk_stochastic(rand(Q,Q));
  obsmat0 = mk_stochastic(rand(Q,O));
  
  % train high mach
  [LL1, prior1, transmat1, obsmat1] = ...
    dhmm_em(train_data1, prior0, transmat0, obsmat0, 'max_iter', 100);
  % train med mach
  [LL2, prior2, transmat2, obsmat2] = ...
    dhmm_em(train_data2, prior0, transmat0, obsmat0, 'max_iter', 100);

  % yhats
  yhat = zeros(size(test_data_y, 1), 1);
  countdiff = 0.0;
  for j = 1:size(test_data_y, 1)
  [loglik1, errors1] = dhmm_logprob(test_data_x(j, 1), prior1, transmat1, obsmat1);
  [loglik2, errors2] = dhmm_logprob(test_data_x(j, 1), prior2, transmat2, obsmat2);
  yhat(j, 1) = loglik1 > loglik2;
  
  if (loglik1 > loglik2)
    use_prior = prior1;
    use_transmat = transmat1;
    use_obsmat = obsmat1;
  else
    use_prior = prior2;
    use_transmat = transmat2;
    use_obsmat = obsmat2;
  end
%   B = multinomial_prob(test_data_x{j, 1}, use_obsmat);
%   path = viterbi_path(use_prior, use_transmat, B);
%   figure;
%   hold on;
%   plot(path, 'bo-');
%   plot(test_data_x{j, 1}, 'r*-');
%   xlim([0, 10]);
%   hold off;
  err_vec(i, 1) = sum(abs(test_data_y - yhat)) / size(yhat, 1);
  end
end
mean(err_vec)

% HMM simulation

% k = 10;
% indices = crossvalind('Kfold', n, k);
% err_vec = zeros(k, 1);
% for i = 1:k
%   testidx = (indices == i);
%   trainidx = ~testidx;
% 
%   % data for high mach and low mach
%   train_data_x = data(trainidx, :);
%   test_data_x = data(testidx, :);
%   train_data_y = y_svo(trainidx, :);
%   test_data_y = y_svo(testidx, :);
%   indices1 = find(train_data_y == 1);
%   indices2 = find(train_data_y == 0);
%   train_data1 = train_data_x(indices1, :);
%   train_data2 = train_data_x(indices2, :);
% 
%   % initial guess of parameters
%   prior0 = normalise(rand(Q,1));
%   transmat0 = mk_stochastic(rand(Q,Q));
%   obsmat0 = mk_stochastic(rand(Q,O));
%   
%   % train high mach
%   [LL1, prior1, transmat1, obsmat1] = ...
%     dhmm_em(train_data1, prior0, transmat0, obsmat0, 'max_iter', 100);
%   % train med mach
%   [LL2, prior2, transmat2, obsmat2] = ...
%     dhmm_em(train_data2, prior0, transmat0, obsmat0, 'max_iter', 100);
% 
%   % yhats
%   yhat = zeros(size(test_data_y, 1), 1);
%   countdiff = 0.0;
%   for j = 1:size(test_data_y, 1)
%   [loglik1, errors1] = dhmm_logprob(test_data_x(j, 1), prior1, transmat1, obsmat1);
%   [loglik2, errors2] = dhmm_logprob(test_data_x(j, 1), prior2, transmat2, obsmat2);
%   yhat(j, 1) = loglik1 > loglik2;
%   
%   if (loglik1 > loglik2)
%     use_prior = prior1;
%     use_transmat = transmat1;
%     use_obsmat = obsmat1;
%   else
%     use_prior = prior2;
%     use_transmat = transmat2;
%     use_obsmat = obsmat2;
%   end
% %   B = multinomial_prob(test_data_x{j, 1}, use_obsmat);
% %   path = viterbi_path(use_prior, use_transmat, B);
% %   figure;
% %   hold on;
% %   plot(path, 'bo-');
% %   plot(test_data_x{j, 1}, 'r*-');
% %   xlim([0, 10]);
% %   hold off;
%   err_vec(i, 1) = sum(abs(test_data_y - yhat)) / size(yhat, 1);
%   end
% end
% mean(err_vec)