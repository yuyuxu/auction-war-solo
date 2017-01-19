function vec1 = standardize(vec)
  vec1 = (vec - min(vec)) / (max(vec) - min(vec));
end