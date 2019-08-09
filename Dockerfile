FROM node:9.11.1-alpine

COPY /src/. /src
WORKDIR /src

RUN npm install --quiet
RUN npm rebuild
RUN npm run build

CMD ["npm", "run", "start"]