.PHONY: start

start:
	docker-compose up --build

down:
	docker-compose down -v
