# Next template

Next.js template for my personal needs.

## Getting started

### Installation and Configuration

In the [application.env](application.env) file you can find:

- The project name
- The docker repository

Copy the [.env.example](.env.example) file to a new file `.env` and fill in the variables.

```bash
cp .env.example .env
```

#### Variables

- `DOCKERHUB_USERNAME` - Dockerhub username
- `DEPLOYMENT_AUTH_EMAIL_FROM` - Name and Email address of magic link sender (e.g. `Next Template <example@email.com>`)
- `DEPLOYMENT_AUTH_EMAIL_HOST` - SMTP host (e.g. `smtp.gmail.com`)
- `DEPLOYMENT_AUTH_EMAIL_PORT` - SMTP port (e.g. `465`)
- `DEPLOYMENT_AUTH_EMAIL_USER` - SMTP username (for gmail, this is your email address)

#### Secrets

- `DEPLOYMENT_AUTH_EMAIL_PASSWORD` - SMTP password (for gmail, this is your app password)
- `DEPLOYMENT_DISCORD_WEBHOOK_URL` - Discord webhook url for alerts in application
- `DOCKERHUB_TOKEN` - Dockerhub password

## Deployments

To configure deployment variables. Create a Github variable or secret and prefix it with `DEPLOYMENT_`.

## Guides

### Database

#### Migrations

To create a new migration, run the following command:

```bash
bun db:generate -- --name "<migration-name>"
```

Then to run all migrations, run:

```bash
bun db:migrate
```

When migration is imperfect,
delete the migration file, delete the new snapshot file in the meta-folder and roll back the \_journal.json file.

When thats done you can run the migration command again.

#### Database in Kubernetes

You can copy the sqlite file over this command:

```bash
kubectl cp <namespace>/<pod-name>:/app/data/db.sqlite ./prod-db.sqlite
```

With k9s you can copy the pod name with `c`

Windows with Datagrip shows a warning locking issues will occur because of WSL.
Copy the file to your Windows filesystem with the following command:

```bash
kubectl cp <namespace>/<pod-name>:/app/data/db.sqlite  /mnt/c/Users/<user>/Documents/
```
