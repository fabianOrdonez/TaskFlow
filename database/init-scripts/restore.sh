#!/bin/bash
sleep 5

mongorestore \
  --username "$MONGO_INITDB_ROOT_USERNAME" \
  --password "$MONGO_INITDB_ROOT_PASSWORD" \
  --authenticationDatabase "admin" \
  --db project_manager \
  /docker-entrypoint-initdb.d/backup/project_manager

echo "Backup restaurado correctamente"
