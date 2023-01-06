# Nestport

## Development

Start a Postgres container

`docker run -d --name mysql-dev -v $HOME/dockervols/mysql-dev:/var/lib/mysql/ -e MYSQL_ROOT_PASSWORD=admin --restart unless-stopped -p 3307:3306 mysql:8 --default-authentication-plugin=mysql_native_password`

Create a develoment database

```sql
CREATE DATABASE dev;
```

Clone the repo and install dependencies

```bash
git clone https://github.com/axtck/nestport.git
cd nestport
npm i
```

Manually set the environment you want to run the server in

```bash
# dev
export SERVER_ENV=development

# or prod
export SERVER_ENV=production
```

Copy the `.env.sample` files in `.src/common/environments/` and remove `.sample` from filename, edit environment variables (use db name used for creating db)

```bash
# for example
DB_DB=dev
DB_PORT=3307
# and so on
```

Also copy the `.env.sample` file in the project root and rename it `.env`, this env file is used outside the app (for migrations, docker, ...)

If an environment variable isn't correctly set, a schema validator will throw an error telling you what needs to be changed

Start the server

```bash
npm run start:dev
```

A migration creates the initial tables

## Containerization

### Docker Compose

For development purposes, Docker Compose is fully set up and works out of the box. Take a look at the `docker-compose.yml` file in `./` and change it to your needs. Make sure your `.env` file is correctly filled in (see steps above).

To run the Docker Compose environment run `npm run compose`.

### DevOps

#### Building the image

The docker image is built based on the `Dockerfile` in `./`, an `ARG` is required for specifying the port to expose in the build.

For example if you want to expose port x, you would use this command to build the spine image (username, version being your username and version of the app, x being the port you would like to use (e.g. 3000)), don't forget to pass an image tag.

`docker build -t username/nestport-m:version --build-arg PORT=x -f Dockerfile .`

#### Running a container

When running a container, it is important to have the correct config (port mapping, environment variables, ...).

Optionally you can give the container a name, it is important that you correctly map the port specified during build to the desired port on the host machine and pass the port again as an environment variable to listen to within the container. Make sure you pass the correct image tag (the one you specified while building).

> `docker run -d --name nestport-m-server -p 3001:3000 -e HOST_SERVER_PORT=3000 -e NODE_ENV=development -e MYSQL_HOST=127.0.0.1 -e MYSQL_USER=root -e MYSQL_PASSWORD=admin -e MYSQL_PORT=3307 -e JWT_AUTHKEY=somekey axtck/spine:1.0.1`

In development it is not really adviced to launch containers this way (connection will fail due to lack of network setup). You only explicitly create an image when you have a new version of your application and then manage it with a container orchestrator (e.g. Kubernetes) that is responsible for the networking, scaling and more.
