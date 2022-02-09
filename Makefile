# Run the make commands in sequence
restart: stop remove-images build start

clean: stop remove-images

build:
	docker build -t kishore007k/post_service ./post-service
# docker build -t kishore007k/comment_service ./comment-service
	docker build -t kishore007k/eventbus_service ./event-bus
# docker build -t kishore007k/query_service ./query-service
# docker build -t kishore007k/moderator_service ./moderator-service

push-images:
	docker push kishore007k/post_service
# docker push kishore007k/comment_service
	docker push kishore007k/eventbus_service
# docker push kishore007k/query_service
# docker push kishore007k/moderator_service

dev:
	docker-compose up

start:
	docker-compose up -d

stop:
	docker-compose down

remove-images:
	docker rmi kishore007k/post_service
# docker rmi kishore007k/comment_service
	docker rmi kishore007k/eventbus_service
# docker rmi kishore007k/query_service
# docker rmi kishore007k/moderator_service


deploy-kubectl:
	kubectl apply -f ./kubernetes/post-depl.yaml
	kubectl apply -f ./kubernetes/eventbus-depl.yaml
	kubectl apply -f ./kubernetes/post-serv.yaml

restart-kubectl:
	kubectl rollout restart deployment posts-depl
	kubectl rollout restart deployment eventbus-depl

remove-kubectl:
	kubectl delete deployment posts-depl
	kubectl delete deployment eventbus-depl
	kubectl delete services posts-depl
	kubectl delete services eventbus_service