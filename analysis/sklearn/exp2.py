from sklearn import linear_model
from sklearn.metrics import mean_squared_error
from sklearn.model_selection import KFold
import numpy as np
import math

file1 = '../data/hand_features1.csv';
file2 = '../data/y_mach.csv';

X = np.loadtxt(file1, delimiter=',');
y = np.loadtxt(file2);

# perm = np.random.permutation(len(y))
# X = X[perm]
# y = y[perm]

num_folds = 10
kf = KFold(n_splits=num_folds)
fold_count = 0
train_rmse = np.zeros(num_folds)
test_rmse = np.zeros(num_folds)
for train_index, test_index in kf.split(X):
  fold_count += 1
  print('fold %d ...' % fold_count)

  X_train, X_test = X[train_index], X[test_index]
  y_train, y_test = y[train_index], y[test_index]
  clf = linear_model.LinearRegression(normalize=True)
  clf = clf.fit(X_train, y_train)
  y_train_pred = clf.predict(X_train)
  rmse = math.sqrt(mean_squared_error(y_train, y_train_pred))
  train_rmse[fold_count - 1] = rmse
  print('train rmse = %f' % rmse)
  y_test_pred = clf.predict(X_test)
  rmse = math.sqrt(mean_squared_error(y_test, y_test_pred))
  test_rmse[fold_count - 1] = rmse
  print('test rmse = %f' % rmse)

print('average train rmse = %f' % np.average(train_rmse))
print('average test rmse = %f' % np.average(test_rmse))


clf = linear_model.LinearRegression(normalize=True)
clf = clf.fit(X, y)
print clf.coef_
