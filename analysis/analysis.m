
% remove action sequence starting with 1 (0, 0, 0)
len = length(X(1:end, 1));
for i = 1:len
  l = length(X{i, 1});
  if X{i, 1}(l, 1) == 25
    X{i, 1} = X{i, 1}(1:end-1, 1);
  end
end

sequence_len = zeros(1, len);
invalid_action_indices = [];
for i = 1:len
  sequence_len(1, i) = length(X{i, 1});
  if X{i, 1}(1, 1) == 1 || length(X{i, 1}) < 3
    invalid_action_indices = [invalid_action_indices, i];
  end
end
% figure;
% histogram(sequence_len);
X(invalid_action_indices, :) = [];
y_mach(invalid_action_indices, :) = [];
y_svo(invalid_action_indices, :) = [];
sequence_len(invalid_action_indices) = [];
y_svo(find(y_svo == 2)) = 1;
y_svo(find(y_svo == 3)) = 0;

% simple analysis
len = size(X, 1);
first_action_rewards = zeros(len, 1);
for i = 1:len
  aid = X{i, 1}(1, 1);
  action = action_index(aid, :);
  first_action_rewards(i, 1) = action(1, 1) * item_rewards(1, 1) + ...
                               action(1, 2) * item_rewards(1, 2) + ...
                               action(1, 3) * item_rewards(1, 3);
end

len = size(X, 1);
final_action_rewards = zeros(len, 1);
for i = 1:len
  l = uint16(length(X{i, 1}));
  aid = X{i, 1}(l, 1);
  action = action_index(aid, :);
  final_action_rewards(i, 1) = action(1, 1) * item_rewards(1, 1) + ...
                               action(1, 2) * item_rewards(1, 2) + ...
                               action(1, 3) * item_rewards(1, 3);
end

X1 = zeros(len, 24);
for i = 1:len
  for j = 1:length(X{i, 1})
    X1(i, X{i, 1}(j, 1)) = X1(i, X{i, 1}(j, 1)) + 1;
  end
end