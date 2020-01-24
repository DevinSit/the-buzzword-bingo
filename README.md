# The Buzzword Bingo

> Some entertainment for your next corporate get-together!

![Screenshot](docs/images/TheBuzzwordBingo.png?raw=true)

The Buzzword Bingo is a small game built using **React** for spicing up the next time corporate leadership insists on changing tech stacks. Share it with your colleagues and see who can get a bingo first. :wink:

The Buzzword Bingo can be accessed [here](https://thebuzzwordbingo.com).

## Table of Contents

* [Why did I build The Buzzword Bingo?](#why-did-i-build-the-buzzword-bingo-)
* [Repo Structure](#repo-structure)
* [Architecture and Tech Stack](#architecture-and-tech-stack)
  + [CI/CD Pipeline](#ci-cd-pipeline)
* [Local Development](#local-development)
  + [Web App Development Prerequisites](#web-app-development-prerequisites)
  + [Bringing up the App](#bringing-up-the-app)
* [Contributing](#contributing)
* [Authors](#authors)
* [License](#license)

## Why did I build The Buzzword Bingo?

Actually, this was originally built as sort of a joke. One of my course presentations was on the topic of 'buzzwords', so I figured I could make the presentation a bit more interesting (and hopefully force more people to pay attention) by making the audience play a game of bingo.

Of course, I'm pretty sure everyone was more engaged playing with the app than paying attention to the presentation _anyways_; you win some, you lose some. :smiley:

Now I've taken that original implementation and made some tweaks to make it suitable as a demo app for my personal portfolio.

## Repo Structure

```
├── backend/                        # Code for the Backend service
├── cloudbuild.backend.yaml         # Configuration for the Backend deployment pipeline
├── cloudbuild.frontend.yaml        # Configuration for the Frontend deployment pipeline
├── docker-compose.yml              # Docker Compose configuration for local development
├── docs/                           # Miscellaneous docs and images for the README
├── frontend/                       # Code for the Frontend service
└── Makefile                        # Useful commands for local development
```

## Architecture and Tech Stack

> Two services:
>
> - Frontend (React)
> - Backend (Express)
>
> Infrastructure:
>
> - Docker containers running on Google Cloud Platform's Cloud Run service

The app is split into two services: the _Frontend_ and the _Backend_.

While the original implementation used **web sockets** for communication between the two services for real-time exchange of player information and game state, the current implementation has been changed to using **long-polling**.

The reason for this so that we can run the app on-the-cheap on GCP **Cloud Run**, which doesn't (yet?) support web sockets. **Cloud Run** is ideal for this kind of demo app usage, since it only charges per-request, and there's a generous number of free requests. 

As such, adapting the app to work with **Cloud Run** was well worth the time for cost-savings.

### CI/CD Pipeline

There's two pipelines here; one for each service.

Since I'm using **GCP** for hosting, making use of their **Cloud Build** service only makes sense. As such, the configuration for the each pipeline can be found in the `cloudbuild.*.yaml` files.

Currently, the pipelines are only really setup for the 'CD' half, since I haven't bothered setting up linting or testing for this demo yet.

Pushing commits to the `master` branch will trigger builds depending on which files were changed.

## Local Development

The following is a guide on how to bring up the pieces of the application for development.

### Web App Development Prerequisites

You must have the following already installed:

- `docker`
- `docker-compose`
- `make`

### Bringing up the App

To start both the _Frontend_ and _Backend_ services together, run:

```
make start
```

Once that's finished starting, you can visit the _Frontend_ at [localhost:3000](http://localhost:3000).

## Contributing

Since this project is just a demo, it is not open for contributions. But feel free to fork it and make it your own!

## Authors

- **Devin Sit**

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.
