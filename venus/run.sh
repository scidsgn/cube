#!/bin/bash

source .venv/bin/activate
uv run start &

for i in $(seq 1 $WORKER_COUNT); do
  echo "Spawning worker $i"
  rq worker venus_queue --url redis://$REDIS_HOSTNAME:$REDIS_PORT &
done

wait