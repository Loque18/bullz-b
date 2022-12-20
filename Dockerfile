from node:14

# workdir

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i -g @nestjs/cli


   
RUN yarn

COPY . .

EXPOSE 3000

CMD ["npm", "run","start"]

