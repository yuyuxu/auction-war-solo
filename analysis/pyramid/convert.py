import csv
import os
import numpy as np
from sklearn.model_selection import KFold


file1 = '../data/hand_features1.csv';
# file2 = '../data/y_mach.csv';
file2 = '../data/y_svo.csv';

X = np.loadtxt(file1, delimiter=',');
y = np.loadtxt(file2);


num_folds = 10
kf = KFold(n_splits=num_folds)
fold_count = 0
for train_index, test_index in kf.split(X):
  fold_count += 1
  print('fold %d ...' % fold_count)

  X_train, X_test = X[train_index], X[test_index]
  y_train, y_test = y[train_index], y[test_index]

  # train_dir = './exp1/fold_%02d_%2d/train' % (fold_count, num_folds)
  # test_dir = './exp1/fold_%02d_%2d/test' % (fold_count, num_folds)
  train_dir = './exp2/fold_%02d_%2d/train' % (fold_count, num_folds)
  test_dir = './exp2/fold_%02d_%2d/test' % (fold_count, num_folds)
  if not os.path.exists(train_dir):
    os.makedirs(train_dir)
  if not os.path.exists(test_dir):
    os.makedirs(test_dir)

  with open(train_dir + '/feature_matrix.txt', 'w') as out_train:
    for i in xrange(len(y_train)):
      # out_str = str(y_train[i])
      out_str = str(int(y_train[i]))
      for j in xrange(X_train.shape[1]):
        out_str = out_str + ' ' + str(j) + ':' + str(X_train[i, j])
      out_str += '\n'
      out_train.write(out_str)

  with open(train_dir + '/config.txt', 'w') as out_train_config:
    # out_train_config.write('numClasses=1\n')
    out_train_config.write('numClasses=2\n')
    out_train_config.write('numDataPoints=%d\n' % X_train.shape[0])
    out_train_config.write('missingValue=false\n')
    out_train_config.write('numFeatures=%d\n' % X_train.shape[1])

  with open(test_dir + '/feature_matrix.txt', 'w') as out_test:
    for i in xrange(len(y_test)):
      # out_str = str(y_test[i])
      out_str = str(int(y_test[i]))
      for j in xrange(X_test.shape[1]):
        out_str = out_str + ' ' + str(j) + ':' + str(X_test[i, j])
      out_str += '\n'
      out_test.write(out_str)

  with open(test_dir + '/config.txt', 'w') as out_test_config:
    # out_test_config.write('numClasses=1\n')
    out_test_config.write('numClasses=2\n')
    out_test_config.write('numDataPoints=%d\n' % X_test.shape[0])
    out_test_config.write('missingValue=false\n')
    out_test_config.write('numFeatures=%d\n' % X_test.shape[1])
