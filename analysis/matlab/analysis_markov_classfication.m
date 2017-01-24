function analysis_markov_classfication(X, y, n_folds)

if nargin == 2
  markov_classfication(X, y, X, y);
else
  err_vec = zeros(n_folds, 1);
  indices = crossvalind('Kfold', size(X, 1), n_folds);
  for i = 1:n_folds
    testidx = (indices == i);
    trainidx = ~testidx;
    err_vec(i, 1) = markov_classfication(...
      X(trainidx, :), y(trainidx), X(testidx, :), y(testidx));
  end
  avg_err = mean(err_vec);
  fprintf('average error rate = %f (%d folds) \n', avg_err, n_folds);
end

end


function err = markov_classfication(X_train, y_train, X_test, y_test)
  % training of the model
  [~, ptrans1, ~, pprior1] = analysis_markov(X_train(y_train == 0, :), 5);
  [~, ptrans2, ~, pprior2] = analysis_markov(X_train(y_train == 1, :), 5);
  
  % testing results  
  m = size(X_test, 1);
  y_pred = zeros(m, 1);
  for i = 1:m
    l = length(X_test{i, 1});
    p1 = log(pprior1(X_test{i, 1}(1, 1), 1));
    p2 = log(pprior2(X_test{i, 1}(1, 1), 1));
    for j = 1:l - 1
      p1 = p1 + log(ptrans1(X_test{i, 1}(1, j), X_test{i, 1}(1, j + 1)));
      p2 = p2 + log(ptrans2(X_test{i, 1}(1, j), X_test{i, 1}(1, j + 1)));
    end
    if p1 < p2
      y_pred(i, 1) = 1;
    end
  end
  err = sum(abs(y_pred - y_test)) / double(m);
  fprintf('testing error rate = %f \n', err);
end