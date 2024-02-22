# Run in development environment

To help save on the time spent loading the ruby gems each time you launch the services with `docker-compose up` you will first build an image using the `ruby:latest` as the base image then use the projects Gemfile to build an image with all the necessary gems used by the app.

I have included a Dockerfile in the root directory that pulls the latest ruby image and uses the projects `Gemfile` to setup a local image.

In the projects root directory:

```sh
    $ sudo docker build -t ruby-gem-host .
```

After the image build's successfully run docker compose to launch the three services.

```sh
    $ sudo docker-compose up
```

Visit:  
[http://localhost:3000](http://localhost:3000)