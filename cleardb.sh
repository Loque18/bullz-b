#!/bin/bash

if [ -f .env ]
then
  export $(cat .env | sed 's/#.*//g' | xargs)
fi

docker rm -f -v $POSTGRES_DATABASE

docker run -d --name $POSTGRES_DATABASE -p $POSTGRES_PORT:5432 -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD -e POSTGRES_DB=$POSTGRES_DATABASE -e POSTGRES_USER=$POSTGRES_USER postgres

npm run start:dev
