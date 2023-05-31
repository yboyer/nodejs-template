# NodeJS template

## *Adjustments*

- Remove front if not needed
  - `./front`
  - `./.husky/pre-commit:front`
- Remove DB if not needed
  - `./postgres_ctx`
  - Prima: `./api/prisma`, `./api/src/models`, `./api/package.json:prisma*`
  - `./docker-compose.yml:postgres`
  - `./.docker/Dockerfile.api:prisma*`
