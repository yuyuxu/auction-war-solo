function [countmat, transmat] = ...
  analysis_markov(X, O, row_label, column_label)

n = size(X, 1);
fprintf('#datapoints: %d\n', (n));
transmat = zeros(O, O);

for i = 1:n
  l = length(X{i, 1});
  for j = 1:l-1
    transmat(X{i, 1}(1, j), X{i, 1}(1, j + 1)) = ...
      transmat(X{i, 1}(1, j), X{i, 1}(1, j + 1)) + 1.0;
  end
end
countmat = transmat;

if nargin == 4
  printmat(transmat, 'count matrix', row_label, column_label)
else
  disp(transmat);
end
for i = 1:O
  if sum(transmat(i, :)) ~= 0
    transmat(i, :) = transmat(i, :) / sum(transmat(i, :));
  else
    transmat(i, :) = zeros(1, O);
  end
end
if nargin == 4
  printmat(transmat, 'trans prob matrix', row_label, column_label)
else
  disp(transmat);
end

end