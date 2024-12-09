ARG NODE_VER
FROM node:${NODE_VER:-22-slim}

USER node
WORKDIR /home/node/app

RUN mkdir node_modules

CMD ["/bin/bash", "-c", "yarn install && yarn start"]
