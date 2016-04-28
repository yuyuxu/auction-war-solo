function analysis_logistic(X, y)
n = size(X, 1);

logi = fitglm(X, y, 'distr', 'binomial', 'link', 'logit')
nrow = 2;
ncol = 2;
figure;
subplot(nrow, ncol, 1);
plotDiagnostics(logi);
subplot(nrow, ncol, 2);
plotDiagnostics(logi, 'cookd');
subplot(nrow, ncol, 3);
plotResiduals(logi, 'fitted');
subplot(nrow, ncol, 4);
plotResiduals(logi, 'probability');

k = 5;
indices = crossvalind('Kfold', n, k);
err_vec = zeros(k, 1);
auc_vec = zeros(k, 1);
figure;
nrow = 2;
ncol = ceil(k / 2);
for i = 1:k
  testidx = (indices == i);
  trainidx = ~testidx;
  b = glmfit(X(trainidx, :), y(trainidx, :), ...
      'binomial', 'link', 'probit');
  yhat = glmval(b, X(testidx, :), 'probit');
  yhat(yhat > 0.5) = 1;
  yhat(yhat <= 0.5) = 1;
  err_vec(i, 1) = sum(abs(y(testidx, :) - yhat)) / size(yhat, 1);
  
  [roc_x, roc_y, roc_t, roc_auc] = perfcurve(y(testidx, :), yhat, '1');
  subplot(nrow, ncol, i);
  plot(roc_x, roc_y);
  xlabel('False positive rate');
  ylabel('True positive rate');
  title('ROC for Classification by Logistic Regression');
  auc_vec(i, 1) = roc_auc;
end
err = mean(err_vec)
auc = mean(auc_vec)

end