# Use the official MongoDB image from Docker Hub
FROM mongo:latest

# Set environment variables
ENV MONGO_INITDB_DATABASE advoc
ENV MONGO_INITDB_ROOT_USERNAME advoc
ENV MONGO_INITDB_ROOT_PASSWORD advoc

# Copy setup script
COPY setup.js /docker-entrypoint-initdb.d/

# Copy custom entrypoint script
COPY entrypoint.sh /usr/local/bin/entrypoint.sh
# Make the script executable
RUN chmod +x /usr/local/bin/entrypoint.sh

ENTRYPOINT ["entrypoint.sh"]

EXPOSE 27017

CMD ["mongod"]