# Backend

The Backend service acts the centralized data store for which users are currently connected to the app, as well as which users have won a round of bingo.

This service was originally designed with web sockets to facilitate instanteous updates of the connected users/winners lists to the Frontend, but that functionality was stripped out in favour of regular old polling to enable deployment on GCP Cloud Run (in essence, serverless containers) for demo purposes.

## Tech Stack

- **Language**: JavaScript/Node
- **API Framework**: Express

## Code Structure

```
├── Dockerfile                  # Docker configuration
├── package.json                # NPM dependencies
├── package-lock.json           # NPM dependencies lock file
└── src/                        # Source files
    ├── app.js                  # Main application setup (i.e. middleware registration)
    ├── components/             # Route controllers and whatnot grouped by domain
    │   └── users/              # Controllers and whatnot for handling users
    ├── index.js                # Entrypoint to the Backend service (mostly just Express setup)
    └── middleware/             # Global utility middleware
```
