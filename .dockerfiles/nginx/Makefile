.PHONY: build-dev-image build-static build-static-image
build-dev-image:
	@mkdir -p dist
	@docker build --target=dev -t harbor.ju0.ru/geophystech/eqalert-front:dev .

build-static-image:
	@rm -rf dist && cp -r ../../dist dist
	@docker buildx create --name common-builder --use || true
	@docker buildx build --platform linux/amd64,linux/arm64 --target=static --push \
		-t harbor.ju0.ru/geophystech/eqalert-front:latest .
	@docker buildx rm common-builder
	@rm -rf dist
	@docker pull harbor.ju0.ru/geophystech/eqalert-front:latest
