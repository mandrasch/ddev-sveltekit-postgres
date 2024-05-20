# ddev-sveltekit-postgres

Simple demo for running SvelteKit with a PostgreSQL database - fully containerized within Docker via [DDEV](https://ddev.com). Access to database in SvelteKit is done via [drizzle ORM](https://orm.drizzle.team/).

Huge thanks to Andy Blum for providing the guide [Node.js Development with DDEV](https://www.lullabot.com/articles/nodejs-development-ddev).

Status: 🚧 Work in Progress 🚧

## Initial Setup

First, [install DDEV](https://ddev.com/get-started/) on your local computer.

Afterwards, git clone this repository to your local computer and execute the following commands in the project folder:

```
cd ddev-sveltekit-postgres/
ddev start
ddev npm install
ddev exec 'cp .env.example .env'

# initial database setup via drizzle
ddev npm run generate
ddev npm run migrate
```

These steps are only need to be done for the first time. Afterwards you can just use `ddev start` and `ddev npm run dev` to access your app https://sveltekit-app.ddev-sveltekit-postgres.ddev.site/ (see below).

## Local Development

```
ddev start

# open site in browser
ddev launch

# run this to start Vite dev server, reload browser afterwards:
ddev npm run dev
```

The app is now running on https://app.ddev-sveltekit-postgres.ddev.site/, happy developing! 🎉

View the database via `ddev tableplus` (drizzle Studio not yet implemented - needs port expose, etc.). You can add a test row there.

## Configure the project

See `.ddev/config.yaml` for configuring database type and NodeJS version. Changes need a `ddev restart` afterwards.

## Deployment via Coolify (WIP)

This setup should be easily self-hostable via Coolify (or other tools like CapRover, ploi.io, Laravel Forge, etc.). See this guide for example: [Deploy Node.js applications on a VPS using Coolify](https://sreyaj.dev/deploy-nodejs-applications-on-a-vps-using-coolify).

I'm currently working on own blog articles about it (could take some time)

## TODOs

- [ ] Route https://orm.drizzle.team/drizzle-studio/overview via Docker / DDEV expose ports
- [ ] Add dummy data command for demo installation
- [ ] GitHub Codespaces support (maybe)

## Acknowledgements

Thanks very much to ...

- Andy Blum - https://www.lullabot.com/articles/nodejs-development-ddev
- https://medium.com/@anasmohammed361/drizzle-orm-with-sveltekit-8aecbc8cc39d
- https://www.tronic247.com/using-drizzle-orm-with-sveltekit/
- https://sveltekit.io/blog/drizzle-sveltekit-integration
- also inspired by [Self-hosting SvelteKit with a VPS, Docker, CapRover and GitHub Actions](https://www.youtube.com/watch?v=NLjolI9FwCU) video by Stanislav Khromov

## How was this created?

Adapted the steps of https://www.lullabot.com/articles/nodejs-development-ddev:

```
# create a new .ddev/config.yaml
ddev config --nodejs-version=20.12.1 --database=postgres:16

# start the local project
ddev start

# Create a new SvelteKit skeleton project
# selected: skeleton project, JavaScript with JSDoc, ESLint + Prettier + Playwright + Vitest
ddev npm create svelte@latest .

# install dependencies
ddev npm install
```

Add additional hostname in .ddev/config.yaml:

```yaml
additional_hostnames:
  - 'app.ddev-sveltekit-postgres'
```

Ran `ddev restart` to apply those changes.

Add a new nginx conf `.ddev/nginx_full/sveltekit-app.conf`:

```
server {

  # fails with nginx: [emerg] could not build server_names_hash, you should increase server_names_hash_bucket_size: 64
  # server_name sveltekit-app.ddev-sveltekit-postgres.ddev.site;
  # shortened it for now:
  server_name app.ddev-sveltekit-postgres.ddev.site;

  location / {
    proxy_pass http://localhost:5173;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_cache_bypass $http_upgrade;
  }

  listen 80;
  listen 443 ssl;

  ssl_certificate /etc/ssl/certs/master.crt;
  ssl_certificate_key /etc/ssl/certs/master.key;

  include /etc/nginx/monitoring.conf;

  error_log /dev/stdout info;
  access_log /var/log/nginx/access.log;

  include /etc/nginx/common.d/*.conf;
  include /mnt/ddev_config/nginx/*.conf;
}
```

Ran `ddev restart` to apply those changes.

Because my domain name was first rather long, I ran into

```bash
nginx: [emerg] could not build server_names_hash, you should increase server_names_hash_bucket_size: 64
```

For now I shortened it till I find out how to customize `etc/nginx/nginx.conf` / report the issue to DDEV.

Ran `ddev restart` to apply those changes.

### Add drizzle ORM

Install dependecies (via https://medium.com/@anasmohammed361/drizzle-orm-with-sveltekit-8aecbc8cc39d):

```bash
# https://orm.drizzle.team/drizzle-studio/overview#quick-start + others:
ddev npm i drizzle-orm
ddev npm i -D drizzle-kit dotenv pg
ddev npm i postgres
```

Created schema via following https://medium.com/@anasmohammed361/drizzle-orm-with-sveltekit-8aecbc8cc39d. Added config files and scripts to package.json. Afterwards connection to db should be possible:

```
# Run Schema Generation
ddev npm run generate
# Push the Schema changes to Db
ddev npm run migrate
```

Added a row to the table via TablePlus and saved it via CMD+S for test purposes.

```
ddev tableplus
```
