This will start up a MQservice use port 15672 for web

```bash
docker run -it --rm --name rabbitmq -e RABBITMQ_DEFAULT_USER=cqrs -e RABBITMQ_DEFAULT_PASS=cqrs  -p 5672:5672 -p 15672:15672 rabbitmq:4.0-management
```