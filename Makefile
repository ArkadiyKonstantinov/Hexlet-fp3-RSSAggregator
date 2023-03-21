develop:
	npx webpack serve

install:
	npm ci

build:
	npm run serve	

test:
	npm test

lint:
	npx eslint .

.PHONY: test