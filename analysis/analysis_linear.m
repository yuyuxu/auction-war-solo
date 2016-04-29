function analysis_linear(X, y, modelspec)
n = size(X, 1);

% fit and test
mdl = fitlm(X, y, modelspec)
tbl = anova(mdl)
nrow = 2;
ncol = 3;
figure;
subplot(nrow, ncol, 1);
plotResiduals(mdl);
subplot(nrow, ncol, 2);
plotDiagnostics(mdl);
subplot(nrow, ncol, 3);
plotDiagnostics(mdl, 'cookd');
subplot(nrow, ncol, 4);
plotResiduals(mdl, 'probability');
subplot(nrow, ncol, 5);
plotResiduals(mdl, 'fitted');
% plot fitted line
figure;
plot(mdl);

% correlation
rho = corr([X X.^2], y)
% subset selection
mdl1 = stepwiselm(X, y, modelspec)
figure;
plot(mdl1);
tbl1 = anova(mdl1)
% k fold
k = 5;
indices = crossvalind('Kfold', n, k);
rmse_vec = zeros(k, 1);
for i = 1:k
  testidx = (indices == i);
  trainidx = ~testidx;
  
  lm = fitlm(X(trainidx, :), y(trainidx, :), ...
       modelspec);
  yhat = feval(lm, X(testidx, :));
  rmse_vec(i, 1) = sqrt(mean((y(testidx, :) - yhat).^2));
end
rmse = mean(rmse_vec)

end