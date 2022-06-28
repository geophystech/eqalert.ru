.PHONY: build-dev-image build-static build-static-image
build-dev-image:
	@cd .dockerfiles/nginx && make build-dev-image

build-static:
	@docker run -it --rm -v $(shell pwd):/var/www/service harbor.ju0.ru/geophystech/eqalert-front:dev bash -c 'yarn install && NODE_ENV=production yarn build'

build-static-image:
	@cd .dockerfiles/nginx && make build-static-image
