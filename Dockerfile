


FROM testbed


#install node and npm
RUN apt-get update
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get install -y nodejs
RUN npm install bower -g


#make directory and copy app
RUN mkdir -p ~/@.stuff/@.code/evolve/evolve-site && cd ~/@.stuff/@.code/evolve/evolve-site
COPY . ~/@.stuff/@.code/evolve/evolve-site
WORKDIR ~/@.stuff/@.code/evolve/evolve-site


#install dependencies
RUN npm install && bower install --allow-root


#expose port
EXPOSE 3000


#run app
CMD ["npm", "start"]