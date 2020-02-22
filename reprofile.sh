node --prof $1
node --prof-process isolate*.log > prof.txt
rm isolate*.log
