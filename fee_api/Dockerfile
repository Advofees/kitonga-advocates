# Pull the latest ruby image
FROM ruby-gem-host:latest

# Create a working directory
RUN mkdir /app2

# Set the working directory
WORKDIR /app2

# Copy Gemfile
COPY Gemfile /app2/Gemfile

# Install dependencies
# RUN bundle install

# Copy the rest of the Rails application files to the container
COPY . .

# Copy the custom entrypoint script to the container
COPY entrypoint.sh /usr/bin/entrypoint.sh
RUN chmod +x /usr/bin/entrypoint.sh

# Set the entrypoint to the custom script
ENTRYPOINT ["entrypoint.sh"]

# Start the application
CMD ["rails", "s", "-b", "0.0.0.0", "-p", "4000"]