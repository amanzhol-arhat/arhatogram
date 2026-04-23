# Arhatogram

Arhatogram is a social media project built with a Django REST API backend and a React frontend. The backend supports user registration/login, posts, comments, likes, follow relationships, and real-time chat via WebSockets.

## Stack

- Backend
  - Django 5
  - Django REST Framework
  - Django Channels
  - Celery
  - Redis
  - PostgreSQL (production) / SQLite (development)
  - JWT authentication via `rest_framework_simplejwt`
- Frontend
  - React 18
  - Create React App
  - Axios
  - React Router
  - React Bootstrap
  - SWR
  - WebSocket client via `react-use-websocket`

## Project layout

- `CoreRoot/` - Django project settings and ASGI configuration
- `core/` - main Django apps and API logic
  - `core.auth` - JWT auth, login/register/refresh
  - `core.user` - custom user model, profile, follow system
  - `core.post` - posts with likes and author validation
  - `core.comment` - comments on posts with likes
  - `core.chat` - conversations, messages, WebSocket consumer
- `social-media-app/` - React frontend application
- `docker-compose.yaml` - local Docker setup for `api`, `db`, `redis`, `worker`, `nginx`, `frontend`
- `Dockerfile` - backend image build
- `req.txt` - Python dependencies
- `pytest.ini` - test configuration

## Features

- JWT user registration/login and token refresh
- Custom `User` model with avatar, bio, follower/following lists
- Posts and comments with liking support
- Cached user profile retrieval via Redis cache
- Real-time chat using Django Channels and Redis
- Celery worker configured for background async tasks
- React frontend for social feed and chat

## Important URLs

- Backend API prefix: `/api/`
- WebSocket chat: `ws://<host>/ws/chat/<conversation_id>/`
- Frontend app (Docker): `http://localhost:3000`

## Docker setup

The project can be run using Docker Compose.

```bash
docker-compose up --build
```

This starts:

- `redis` for cache, Channels, and Celery broker/result backend
- `db` PostgreSQL database
- `api` Django backend running with Daphne
- `worker` Celery worker
- `frontend` React app served by Nginx on port `3000`
- `nginx` reverse proxy for backend

### Useful commands

```bash
docker-compose up --build api

docker-compose up --build worker

docker-compose up --build frontend
```

## Local development

1. Create a Python environment.
2. Install backend dependencies:

```bash
pip install -r req.txt
```

3. Install frontend dependencies:

```bash
cd social-media-app
yarn install
```

4. Run backend locally:

```bash
python manage.py runserver
```

5. Run frontend locally:

```bash
cd social-media-app
yarn start
```

## Environment variables

Create a `.env` file for local Docker or development environment with at least:

```env
SECRET_KEY=your_secret_key_here
DB_USER=postgres
DB_PASSWORD=postgres
DB_NAME=postgres
DATABASE_URL=postgres://postgres:postgres@db:5432/postgres
JWT_SECRET_KEY=your_jwt_secret
JWT_ACCESS_EXPIRATION_MINUTES=60
JWT_REFRESH_EXPIRATION_DAYS=1
```

If `DATABASE_URL` is not set, the development settings use SQLite at `db.sqlite3`.

## Tests

Run backend tests from the project root:

```bash
pytest
```

or with Django test runner:

```bash
python manage.py test
```

The project includes `pytest.ini` with `DJANGO_SETTINGS_MODULE = CoreRoot.settings`.

## API endpoints

Key routes are registered in `core/routers.py`:

- `POST /api/auth/register/` - register a new user
- `POST /api/auth/login/` - login and obtain JWT tokens
- `POST /api/auth/refresh/` - refresh access token
- `GET /api/users/` - list users
- `GET /api/users/<id>/` - retrieve user profile
- `POST /api/users/<id>/follow/` - follow/unfollow a user
- `GET /api/post/` - list posts
- `POST /api/post/` - create a post
- `POST /api/post/<id>/like/` - like a post
- `POST /api/post/<id>/remove_like/` - unlike a post
- `POST /api/post/<post_id>/comment/` - add a comment
- `POST /api/comments/<id>/like/` - like a comment
- `POST /api/comments/<id>/remove_like/` - unlike a comment
- `GET /api/chats/` - list conversations
- `POST /api/chats/` - create/open a conversation
- `GET /api/messages/?conversation_id=<id>` - get messages for conversation

## Real-time chat

The chat service uses Django Channels and Redis. The WebSocket endpoint is:

```text
ws://<host>/ws/chat/<conversation_id>/
```

Messages are persisted in the `core.chat` models and broadcast to conversation participants.

## Notes

- `CoreRoot/settings/base.py` contains common settings
- `CoreRoot/settings/dev.py` configures SQLite by default and debug mode
- `Dockerfile` uses production settings (`CoreRoot.settings.prod`)
- Redis is used for caching, Celery broker/result backend, and Channels layer
