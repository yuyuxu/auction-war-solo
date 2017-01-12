clc;
close all;

feature = [sequence_len, first_reward, final_reward, avg_reward, ...
  ratio_counter_offer, ratio_repeated_offer, ratio_peak, ratio_valley, ...
  study_time];
label = y_mach;

feature_normalized = standardize(feature);

analysis_linear(feature, label, 'quadratic');