FROM node:lts-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["./chatApp/package.json", "./chatApp/package-lock.json*", "./chatApp/npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv ./node_modules ../
COPY ./chatApp ./chatApp
COPY ./_html_css ./_html_css
EXPOSE 4000
RUN chown -R node /usr/src/app
USER node
CMD ["node", "./chatApp/server.js"]
