function analysis_svm(X, y)
n = size(X, 1);

k = 5;
indices = crossvalind('Kfold', n, k);
err_vec = zeros(k, 1);
auc_vec = zeros(k, 1);
figure;
nrow = 2;
ncol = ceil(k / 2);
flag_plot = false;
plot_count = 1;
for i = 1:k
  testidx = (indices == i);
  trainidx = ~testidx;
  svm_struct = svmtrain(X(trainidx, :), y(trainidx, :), ...
                        'showplot', flag_plot);
  yhat = svmclassify(svm_struct, X(testidx, :), ...
                     'showplot', flag_plot);
  err_vec(i, 1) = sum(abs(y(testidx, :) - yhat)) / size(yhat, 1);
  
  [roc_x, roc_y, roc_t, roc_auc] = perfcurve(y(testidx, :), yhat, '1');
  subplot(nrow, ncol, plot_count);
  plot_count = plot_count + 1;
  plot(roc_x, roc_y);
  xlabel('False positive rate');
  ylabel('True positive rate');
  title('ROC for Classification by Logistic Regression');
  auc_vec(i, 1) = roc_auc;
end
err = mean(err_vec)
auc = mean(auc_vec)

end