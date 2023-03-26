# ft_transcendence

## Requirements
- `git` and `git-lfs`
- `docker` and `docker-compose`

## Getting Started
1. Clone the repository.
```
git clone https://github.com/fyusuf-a/ft_transcendence.git && cd ft_transcendence
```

2. Create an application on the 42 intra with the redirect URI set to `http://localhost:8000/auth/callback`

3. Create the `.env` file:
```
cp .env.example .env
```
Fill the values in the `.env` with the help of the [information below](#.env-file).

4. Build and Start the containers
```
docker-compose up --build
```
This will build and start the default containers (the database, the backend and the frontend).

`docker-compose --profile adminer` starts the Adminer container to debug the database

## Usage
- The frontend will be available at `http://localhost:8000/`
- The backend swagger will be available at `http://localhost:8000/docs` in debug mode (using the `Dockerfile` for the backend, not the `Dockerfile.prod`)
- Adminer, if enabled, will be available at `http://localhost:8888/`

## Testing
### Backend
```
docker exec -t ft_transcendence-backend-1 npm run test        # run unit tests one time
docker exec -t ft_transcendence-backend-1 npm run test:watch  # watch for changes and run unit tests
docker exec -t ft_transcendence-backend-1 npm run test:e2e    # run end-to-end tests one time
```

## `.env` file

**Developers, please do not commit changes to `./.env.example` as the values it contains are used in the CI**

### Images and Dockerfiles

- `NODE_IMAGE`: the node image used in the backend build and the development frontend build
	* `lts-alpine`
	* `16.15-alpine`...
- `NGINX_IMAGE`: the nginx image used in the production frontend build
	* `stable-alpine`
	* `1.22-alpine`...
- `BACKEND_DOCKERFILE`:
	* `Dockerfile`: the image does not need a rebuild if a modification occurs if `BACKEND_DEBUG` is set to 1. If a package is added tough, you need to run a `docker exec [name_of_container] npm install` or restart the container
	* `Dockerfile.prod`: faster launch time, the image needs a rebuild for every modification to the code. No memory overhead as files are not watched
- `FRONTEND_DOCKERFILE`:
	* `Dockerfile`: the site is served by the Vite development server with hot reload
	* `Dockerfile.prod`: the site is served by nginx

## Environment variables

- `URL`: the URL of the website (without trailing slash)
  * `http://localhost:8000`
  * `https://mydomain` ...
- `PROXY_PORT`: the port on which the website is served (not necessarily the same port as in the URL in the case of a reverse proxy)
- `BACKEND_42_UID`: the ID of the 42 API application (as given by the intranet)
- `BACKEND_42_SECRET`: the secret of the 42 API application (as given by the intranet)
- `BACKEND_DEBUG`: if enabled, backend will refresh everytime you modify the source code
  * possible values: `0` or `1`
- `BACKEND_JWT_SECRET_KEY`: the secret key is used to encrypt your JWT. For production purposes, please generate a secret at least 32 character long and secure
- `BACKEND_SALT_ROUNDS`: the number of rounds used in password hasing. Default: 10
- `DB_HOST`: name of the Postgres host
- `DB_NAME`: name of the Postgres database
- `DB_PASSWORD`: Postgres password
- `DB_USER`: Postgres user
- `DISABLE_AUTHENTICATION`: disable authentification for testing or development
  * possible values `true` or `false`
