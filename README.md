# ft_transcendence

## Requirements
- Docker

## Getting Started
### Clone the repository.
```
git clone https://github.com/fyusuf-a/ft_transcendence.git && cd ft_transcendence
```

### Create the `.env` file
The [.env.example](https://github.com/fyusuf-a/ft_transcendence/blob/master/.env.example) file shows the required variables to set before starting the containers
```
cp .env.example .env
```
Copy the example file into `.env` and supply any missing values

### Build and Start the containers
```
docker-compose up --build
```
This will build and start the default containers (the database and the backend).

`docker-compose` options:
- `--profile debug` starts the Adminer container to debug the database
- `--profile frontend` starts the frontend container

## Usage
- The backend will be available at `http://localhost:8080/`
- The frontend will be available at `http://localhost:8000/`
- Adminer will be available at `http://localhost:8888/`

## Testing
### Backend
```
docker exec -t ft_transcendence-backend-1 npm run test        # run unit tests one time
docker exec -t ft_transcendence-backend-1 npm run test:watch  # watch for changes and run unit tests
docker exec -t ft_transcendence-backend-1 npm run test:e2e    # run end-to-end tests one time
```
