#!/bin/bash

# # Check if the database exists and is up
# if [ "$DATABASE_URL" = "" ]; then
#   echo "WARNING: DATABASE_URL is not set. Database migrations and seeding will be skipped."
# else
#   echo "Waiting for the database to be ready..."
#   while ! ncat -w 1 -z "$DATABASE_HOST" "$DATABASE_PORT"; do
#     sleep 1
#   done
#   echo "Database is ready."
# fi

# Run database migrations
bundle exec rails db:migrate

# Run database seeding (if needed)
bundle exec rails db:seed

# Execute the command received as arguments to the entrypoint script
exec "$@"