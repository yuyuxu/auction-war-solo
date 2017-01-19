from sklearn import tree
from sklearn.metrics import accuracy_score
from sklearn.model_selection import KFold
import pydotplus
import numpy as np
import math

file1 = '../data/hand_features1.csv';
file2 = '../data/y_svo.csv';

X = np.loadtxt(file1, delimiter=',');
y = np.loadtxt(file2);

# perm = np.random.permutation(len(y))
# X = X[perm]
# y = y[perm]


num_folds = 10
kf = KFold(n_splits=num_folds)
fold_count = 0
train_acc = np.zeros(num_folds)
test_acc = np.zeros(num_folds)
for train_index, test_index in kf.split(X):
  fold_count += 1
  print('fold %d ...' % fold_count)

  X_train, X_test = X[train_index], X[test_index]
  y_train, y_test = y[train_index], y[test_index]
  clf = tree.DecisionTreeClassifier(
    # random_state=0,
    max_depth=3,
    min_samples_split=40,
    min_samples_leaf=40
    )
  clf = clf.fit(X_train, y_train)

  # dot_data = tree.export_graphviz(clf, out_file=None)
  # graph = pydotplus.graph_from_dot_data(dot_data)
  # graph.write_pdf("exp4.pdf")

  y_train_pred = clf.predict(X_train)
  acc = accuracy_score(y_train, y_train_pred)
  train_acc[fold_count - 1] = acc
  print('train acc = %f' % acc)
  y_test_pred = clf.predict(X_test)
  acc = accuracy_score(y_test, y_test_pred)
  test_acc[fold_count - 1] = acc
  print('test acc = %f' % acc)

print('average train acc = %f' % np.average(train_acc))
print('average test acc = %f' % np.average(test_acc))
