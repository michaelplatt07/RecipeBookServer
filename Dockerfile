FROM debian:buster

RUN apt-get update

# Various tools for downloading and code editing
RUN apt-get install -y curl
RUN apt-get install -y vim
RUN apt-get install -y emacs25

# Uncomment for Node 14
RUN curl -sL https://deb.nodesource.com/setup_14.x | bash -
RUN apt-get install -y nodejs

# Install stuff so we can intall Mongo
RUN apt-get install -y wget

# Install mongo
# TODO(map) Maybe we can add this stuff before doing the first update??
RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add -
RUN echo "deb http://repo.mongodb.org/apt/debian buster/mongodb-org/4.2 main" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list
RUN apt-get update
RUN apt-get install -y tmux
RUN apt-get install -y mongodb-org*
RUN apt-get install -y python3
RUN apt-get install -y python3-venv

# Uncomment for Node 12
#curl -sL https://deb.nodesource.com/setup_12.x | bash -
#apt-get install -y nodejs

# Install NVM so different versions of Node can be used for testing or whatever else.
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.3/install.sh | bash

# Create work dir to copy the server into
WORKDIR /usr/src/recipe-book-server

# TODO(map) Maybe pull from github instead of copying the directory
COPY . .
RUN npm install

# Create the VENV for allowing scraping and install requirements.
RUN python3 -m venv scraper_env
RUN . ./scraper_env/bin/activate && pip install -r requirements.txt

# Create necessary Mongo directories for data to be able to be stored.
RUN mkdir -p /data/db /data/configdb && chown -R mongodb:mongodb /data/db /data/configdb

# Ports to expose
EXPOSE 3000
# Mongo port required to be able to launch
EXPOSE 27017

