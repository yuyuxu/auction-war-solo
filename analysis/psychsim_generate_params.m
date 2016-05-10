count = 0;
for wr = 0.01:0.01:0.05
  for wa = 1:1:5
    for ws = 1:2:10
      for wfa = 1:2:10
        for wfb = 1:2:10
          count = count + 1;
          if count <= 800
            continue;
          end
          if count > 900
            error('missing 100');
          end
          fileid = fopen(sprintf('bsub_py%04d.bash', count), 'w');
          fprintf(fileid, '#!/bin/sh\n');
          fprintf(fileid, '#BSUB -J JOB.%04d\n', count);
          fprintf(fileid, '#BSUB -o out_file%04d\n', count);
          fprintf(fileid, '#BSUB -e err_file%04d\n', count);
          fprintf(fileid, '#BSUB -n 1\n');
          if count <= 1575
            fprintf(fileid, '#BSUB -q ser-par-10g-2\n');
          elseif count <= 2350
            fprintf(fileid, '#BSUB -q ser-par-10g-3\n');
          else
            fprintf(fileid, '#BSUB -q ser-par-10g\n');
          end
          fprintf(fileid, '#BSUB -cwd /home/xu.yuyu/research/psychsim\n');
          fprintf(fileid, 'work=/home/xu.yuyu/research/psychsim\n');
          fprintf(fileid, 'cd $work\n');
          fprintf(fileid, 'tempfile1=hostlistrun\n');
          fprintf(fileid, 'tempfile2=hostlist-tcp\n');
          fprintf(fileid, 'echo $LSB_MCPU_HOSTS > $tempfile1\n');
          fprintf(fileid, 'declare -a hosts\n');
          fprintf(fileid, 'read -a hosts < ${tempfile1}\n');
          fprintf(fileid, 'for ((i=0; i<${#hosts[@]}; i += 2)) ;\n');
          fprintf(fileid, 'do\n');
          fprintf(fileid, '  HOST=${hosts[$i]}\n');
          fprintf(fileid, '  CORE=${hosts[(($i+1))]}\n');
          fprintf(fileid, '  echo $HOST:SCORE >> $tempfile2\n');
          fprintf(fileid, 'done\n');
          fprintf(fileid, 'PYTHONPATH=/home/xu.yuyu/research/psychsim python Yuyu_Model_0429_Dan.py -l 2 -ho 4 -d 1.0 -r 10.0 -sb 0 -db 0 -s2db 0 -d2sb 0 -c 0.5 -wr %f -wa %f -ws %f -wfa %f  -wfb %f\n', wr, wa, ws, wfa, wfb);
          fprintf(fileid, 'rm $work/$tempfile1\n');
          fprintf(fileid, 'rm $work/$tempfile2\n');
          fclose(fileid);
        end
      end
    end
  end
end
