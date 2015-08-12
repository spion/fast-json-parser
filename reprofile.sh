node --prof --max_inlining_levels=1 $1
node-tick-processor isolate*.log > prof.txt
rm isolate*.log
