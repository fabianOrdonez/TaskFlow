FROM mongo:6.0


COPY ./project_manager /docker-entrypoint-initdb.d/backup/project_manager
COPY ./project_manager /docker-entrypoint-initdb.d/backup/project_manager

COPY ./init-scripts/restore.sh /docker-entrypoint-initdb.d/restore.sh
RUN chmod +x /docker-entrypoint-initdb.d/restore.sh

# Exponer el puerto de MongoDB
EXPOSE 27017

