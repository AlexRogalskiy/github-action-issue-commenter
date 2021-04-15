FROM node:lts-alpine

LABEL version="0.0.0-dev"
LABEL repository="https://github.com/AlexRogalskiy/github-action-issue-commenter"
LABEL homepage="https://github.com/AlexRogalskiy/github-action-issue-commenter"
LABEL maintainer="Nullables, Inc. <hello@nullables.io> (https://nullables.io)"

LABEL "com.github.actions.name"="GitHub action for issue/pull request comments"
LABEL "com.github.actions.description"="Automatically generates comments on issues/pull requests by provided parameters"
LABEL "com.github.actions.icon"="git-pull-request"
LABEL "com.github.actions.color"="purple"

# Copy project sources
COPY dist/index.js .

COPY package.json .
COPY package-lock.json .

# Install project dependencies
RUN npm install

# Run package bundle
ENTRYPOINT ["node", "/index.js"]
