function analysis_logistic(X, y)
n = size(X, 1);

k = 10;
indices = crossvalind('Kfold', n, k);
err_vec = zeros(k, 1);
auc_vec = zeros(k, 1);
figure;
nrow = 2;
ncol = ceil(k / 2);
for i = 1:k
  testidx = (indices == i);
  trainidx = ~testidx;
  [b, FitInfo] = lassoglm(X(trainidx, :), y(trainidx, :), 'binomial', 'CV', 10);
  indx = FitInfo.Index1SE;
  b0 = b(:,indx);
  nonzeros = sum(b0 ~= 0);
  cnst = FitInfo.Intercept(indx);
  b1 = [cnst;b0];
  yhat = glmval(b1, X(testidx, :), 'logit');
  yhat(yhat > 0.5) = 1;
  yhat(yhat <= 0.5) = 0;
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