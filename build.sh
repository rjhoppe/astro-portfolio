# Load all environment variables from .env file
export $(grep -v '^#' .env | xargs)

# Build Docker image with build arguments from .env
docker build $(grep -v '^#' .env | sed 's/^/--build-arg /' | sed 's/=/="/' | sed 's/$/"/') -t astro-portfolio .