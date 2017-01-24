function [ctrans, ptrans, cprior, pprior] = ...
  analysis_markov(X, O, row_label, column_label)

n = size(X, 1);
ptrans = zeros(O, O);
pprior = zeros(O, 1);

for i = 1:n
  l = length(X{i, 1});
  for j = 1:l-1
    ptrans(X{i, 1}(1, j), X{i, 1}(1, j + 1)) = ...
      ptrans(X{i, 1}(1, j), X{i, 1}(1, j + 1)) + 1.0;
  end
  pprior(X{i, 1}(1, 1)) = ...
    pprior(X{i, 1}(1, 1)) + 1;
end
cprior = pprior;
pprior = pprior / sum(pprior);
ctrans = ptrans;

for i = 1:O
  if sum(ptrans(i, :)) ~= 0
    ptrans(i, :) = ptrans(i, :) / sum(ptrans(i, :));
  else
    ptrans(i, :) = zeros(1, O);
  end
end

% printing
fprintf('#datapoints: %d\n', (n));
if nargin == 4
  printmat(ctrans, 'count trans matrix', row_label, column_label);
  printmat(ptrans, 'prob trans matrix', row_label, column_label);
  printmat(cprior, 'count prior matrix', row_label, 'count');
  printmat(pprior, 'prob prior matrix', row_label, 'prob');
else
  disp(ctrans);
  disp(ptrans);
  disp(cprior);
  disp(pprior);
end

end