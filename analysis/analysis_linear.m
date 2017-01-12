function analysis_linear(X, y, modelspec)
n = size(X, 1);

% fit and test
fprintf('fit linear model ... \n');
mdl = fitlm(X, y, modelspec)
anova(mdl)
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
figure;
plot(mdl);

% correlation
fprintf('correlation ... \n');
corr(X, y)
corr(X.^2, y)

% subset selection
fprintf('subset selection ... \n');
mdl1 = stepwiselm(X, y, modelspec)
anova(mdl1)
figure;
plot(mdl1);

% % k fold
% fprintf('k = 5 fold ... \n');
% k = 5;
% indices = crossvalind('Kfold', n, k);
% rmse_vec = zeros(k, 1);
% for i = 1:k
%   testidx = (indices == i);
%   trainidx = ~testidx;  
%   lm = fitlm(X(trainidx, :), y(trainidx, :), ...
%        modelspec);
%   yhat = feval(lm, X(testidx, :));
%   rmse_vec(i, 1) = sqrt(mean((y(testidx, :) - yhat).^2));
% end
% rmse = mean(rmse_vec)

end