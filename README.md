# Nestport

### Development

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
