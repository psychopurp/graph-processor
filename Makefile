build:
	export GIN_MODE=release
	go build -o output/bin/hello

run:
	exec output/bin/hello

clean:
	rm -rf output