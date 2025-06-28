# Next template

Next.js template for my personal needs.

## Getting started

### Installation and Configuration

Copy the [.env.example](.env.example) file to a new file `.env` and fill in the variables.

```bash
cp .env.example .env
```

#### Variables

- `APPLICATION_NAME` - Used as an identifier for multiple actions such as the terraform workspace.
- `IMAGE_REPOSITORY` - Image repository to store image to.
- `BASE_DOMAIN` - Domain where to host the application (tags deployed to this domain, pull request's to a subdomain: the sha of the commit.)
- `DOCKERHUB_USERNAME` - Dockerhub username
- `AUTH_EMAIL_FROM_NAME` - Name and Email address of magic link sender (e.g. `Next Template <example@email.com>`)

#### Secrets

- `AUTH_SECRET` - AUTH secret for encrypting jwt's
- `AUTH_EMAIL_USER` - SMTP username (for gmail, this is your email address)
- `AUTH_EMAIL_HOST` - SMTP host (e.g. `smtp.gmail.com`)
- `AUTH_EMAIL_PORT` - SMTP port (e.g. `465`)
- `AUTH_EMAIL_PASSWORD` - SMTP password (for gmail, this is your app password)
- `DEPLOYMENT_DISCORD_WEBHOOK_URL` - Discord webhook url for alerts in application
- `DOCKERHUB_TOKEN` - Dockerhub password

## Deployments

To configure deployment variables.
Create a Github variable or secret and prefix it with `DEPLOYMENT_`.

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
