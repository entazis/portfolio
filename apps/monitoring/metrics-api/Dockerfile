FROM node:22-alpine
WORKDIR /app
COPY server.js .
RUN npm install express node-fetch
ENV PORT=8080
EXPOSE 8080
CMD ["node", "server.js"]
