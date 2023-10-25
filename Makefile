BIN_NAME=serve

all: clear serve

clear:
	go clean
	rm -rf ${BIN_NAME}

serve:
	go build -o ${BIN_NAME} ./cmd/serve
	./${BIN_NAME}


