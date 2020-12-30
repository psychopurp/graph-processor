common:
	export GIN_MODE=release

build:common
	CGO_ENABLED=0 GOOS=linux GOARCH=amd64 go build -o main

build-mac:common
	export GIN_MODE=release
	go build -o output/bin/main


run:
	exec output/bin/main 

clean:
	rm -rf output


push:
	rsync -av -e ssh --exclude='web/node_modules' ../graph-processor/  Makefile finder@47.95.218.42:~/app/graph-processor