function analysis_compare_markov(X1, X2)

m = size(X1, 1);
n = size(X1, 2);
pmat = zeros(m, n);
dmat = zeros(m, 1);

for i = 1:m
  [~, ~, dmat(i, 1)] = crosstab(X1(i, :), X2(i, :));
  for j = 1:n
    ctable = zeros(2, 2);
    ctable(1, 1) = X1(i, j);
    ctable(1, 2) = sum(X1(i, :)) - X1(i, j);
    ctable(2, 1) = X2(i, j);
    ctable(2, 2) = sum(X2(i, :)) - X2(i, j);
    [~, pmat(i, j), ~] = fishertest(ctable, 'Tail', 'left', 'Alpha', 0.01);
  end
end

disp(pmat);
% disp(dmat);
end