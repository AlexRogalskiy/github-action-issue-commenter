## Setting base OS layer
## docker build -t container_tag --build-arg IMAGE_SOURCE=node IMAGE_TAG=lts-alpine .
ARG IMAGE_SOURCE=node
ARG IMAGE_TAG=lts-alpine

FROM $IMAGE_SOURCE:$IMAGE_TAG

MAINTAINER Alexander Rogalskiy <@AlexRogalskiy>

## Setting arguments
ARG VERSION="0.0.0-dev"
ARG VCS_REF="$(date -u +\"%Y-%m-%dT%H:%M:%SZ\")"
ARG BUILD_DATE="$(git rev-parse --short HEAD)"
ARG HOME_DIR="/usr/src/app"

## Setting metadata
LABEL version=$VERSION
LABEL vcs-ref=$VCS_REF
LABEL build-date=$BUILD_DATE

LABEL repository="https://github.com/AlexRogalskiy/github-action-issue-commenter"
LABEL homepage="https://github.com/AlexRogalskiy/github-action-issue-commenter"
LABEL maintainer="Nullables, Inc. <hello@nullables.io> (https://nullables.io)"

LABEL "com.github.actions.name"="GitHub action for issue/pull request comments"
LABEL "com.github.actions.description"="Automatically generates comments on issues/pull requests by provided parameters"
LABEL "com.github.actions.icon"="git-pull-request"
LABEL "com.github.actions.color"="purple"

## Setting environment variables
ENV HOME $HOME_DIR
ENV LC_ALL en_US.UTF-8
ENV LANG ${LC_ALL}

## Installing dependencies
RUN apk add --no-cache git

## Creating work directory
WORKDIR $HOME

## Copying project sources
COPY dist/index.js .

COPY package.json .
COPY package-lock.json .

## Installing project dependencies
RUN npm install

## Running package bundle
ENTRYPOINT [ "sh", "-c", "node $HOME/index.js" ]
