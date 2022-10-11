#!/bin/bash

docker run -d -p 6379:6379 redis

export PORT=3000
export REDIS_URL=redis://localhost:6379
export JWT_SECRET="NOT_A_REAL_SECRET"

node app.js