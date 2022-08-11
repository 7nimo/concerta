FROM node:16-alpine AS development

ENV NODE_ENV=development

WORKDIR /app

RUN yarn set version canary

COPY package.json /app
COPY yarn.lock /app
COPY .yarnrc.yml /app
COPY .yarn /app/.yarn

RUN yarn install

COPY . .

CMD [ "yarn", "dev" ]