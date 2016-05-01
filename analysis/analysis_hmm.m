function analysis_hmm(X, y, c, Q, O, plot_data_index)

% -- HMM general analysis on whole data set
% initial guess of parameters
prior0 = normalise(rand(Q, 1));
transmat0 = mk_stochastic(rand(Q, Q));
obsmat0 = mk_stochastic(rand(Q, O));

% improve guess of parameters using EM
[~, prior1, transmat1, obsmat1] = ...
  dhmm_em(X, prior0, transmat0, obsmat0, 'max_iter', 100);

% use model to compute log likelihood
% loglik = dhmm_logprob(X, prior1, transmat1, obsmat1);

% plot state change of one data
one_data = X{plot_data_index, :};
B = multinomial_prob(one_data, obsmat1);
path = viterbi_path(prior1, transmat1, B);
figure;
hold on;
plot(path, 'bo-');
plot(one_data, 'r*-');
xlim([0, 10]);
hold off;

% -- HMM classification
if c < 2
  return;
end

n = size(X, 1);
k = 10;
indices = crossvalind('Kfold', n, k);
err_vec = zeros(k, 1);
for i = 1:k
  testidx = (indices == i);
  trainidx = ~testidx;

  % data for high mach and low mach
  train_data_x = X(trainidx, :);
  test_data_x = X(testidx, :);
  train_data_y = y(trainidx, :);
  test_data_y = y(testidx, :);

  % initial guess of parameters
  prior0 = normalise(rand(Q, 1));
  transmat0 = mk_stochastic(rand(Q, Q));
  obsmat0 = mk_stochastic(rand(Q, O));

  hmm_models = cell(c, 3);  
  for j = 1:c
    indices_c = train_data_y == (j - 1);
    train_data_xc = train_data_x(indices_c, :);
    
    % train class c
    [~, hmm_models{j, 1}, hmm_models{j, 2}, hmm_models{j, 3}] = ...
      dhmm_em(train_data_xc, prior0, transmat0, obsmat0, 'max_iter', 100);
  end

  % yhats
  yhat = zeros(size(test_data_y, 1), 1);
  for j = 1:size(test_data_y, 1)
    ll_vec = zeros(c, 1);
    for x = 1:c
      [ll_vec(x, 1), ~] = ...
        dhmm_logprob(test_data_x(j, 1), hmm_models{x, 1}, ...
                     hmm_models{x, 2}, hmm_models{x, 3});
    end
    [~, max_id] = max(ll_vec);
    yhat(j, 1) = max_id - 1;
  end
  err_vec(i, 1) = sum(test_data_y ~= yhat) / size(yhat, 1);
  fprintf('- hmm: fold %d, error rate: %f \n', i, err_vec(i, 1));
end

fprintf('--- mean error rate is: %f\n\n', mean(err_vec));

% -- HMM simulation
% ...

end

