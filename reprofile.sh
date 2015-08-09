node --prof perf/perf-main
node-tick-processor isolate*.log > prof.txt
rm isolate*.log
