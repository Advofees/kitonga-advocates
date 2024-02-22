# Pull the latest ruby image
FROM ruby:latest

# Create a working directory
RUN mkdir /app

# Set the working directory
WORKDIR /app

# Copy Gemfile
COPY fee_api/Gemfile .

# Install dependencies
RUN gem install bundler && \
    bundle install --jobs 4 --retry 3