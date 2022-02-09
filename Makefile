# Run the make commands in sequence
restart: stop remove-images build start

clean: stop remove-images

build:
	docker build -t post_service ./post-service
	docker build -t comment_service ./comment-service
	docker build -t eventbus_service ./event-bus
	docker build -t query_service ./query-service
	docker build -t moderator_service ./moderator-service

dev:
	docker-compose up

start:
	docker-compose up -d

stop:
	docker-compose down

remove-images:
	docker rmi post_service
	docker rmi comment_service
	docker rmi eventbus_service
	docker rmi query_service
	docker rmi moderator_service
