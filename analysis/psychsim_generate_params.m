fileid = fopen('params.txt', 'w');
for wr = 0.01:0.01:0.05
  for wa = 1:1:5
    for ws = 1:2:10
      for wfa = 1:2:10
        for wfb = 1:2:10
          fprintf(fileid, 'PYTHONPATH=/home/xu.yuyu/research/psychsim python Yuyu_Model_0429_Dan.py -l 2 -ho 3 -d 1.0 -r 10.0 -sb 0 -db 0 -s2db 0 -d2sb 0 -c 0.5 -wr %f -wa %f -ws %f -wfa %f  -wfb %f\n', wr, wa, ws, wfa, wfb);
        end
      end
    end
  end
end
fclose(fileid);