#!/bin/sh
set -e

docker compose down --volumes
docker compose up --build --detach
