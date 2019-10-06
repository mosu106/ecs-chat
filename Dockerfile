FROM node:9.11.1-alpine
WORKDIR /app
COPY src ./
RUN npm install --quiet
COPY . .
RUN npm run build
ENV HOST 0.0.0.0
EXPOSE 3000
# 起動コマンド
CMD ["npm", "run", "start"]