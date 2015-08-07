node --prof lib/test/perf
node-tick-processor isolate*.log > prof.txt
rm isolate*.log
