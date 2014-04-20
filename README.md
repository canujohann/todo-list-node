

#　Todo List (nodejs, express , mongoDB)　##


## mongoDB settings　###


create if not exists
```
sudo mkdir -p /data/db/
sudo chown `id -u` /data/db
```

start mongodb
```
mongod
```

## install librairies　##

```
npm install socket.io
npm install mongoose
```

##　Create a new express project　##

```
cd /Users/MyPlace/workspace/javascript
express install -t ejs chat
```

## Deploy with Heroku ##

When deploying whith Heroku, there are few steps you have to folloewd for application to work.

### Enable sockets　###

```
heroku labs:enable websockets
```

> more details here : https://devcenter.heroku.com/articles/node-websockets

###　Port setting　###

Port is defined in "process.env.PORT" :

```
.listen(process.env.PORT || 5000)
```

> more details here : https://devcenter.heroku.com/articles/getting-started-with-nodejs#write-your-app

### Add a Procfile in your appli root path (for launching application)　###

> Add a Procfile in your appli root path (for launching application)

```
vi Procfile
web: node app.js
```

> more details here : https://devcenter.heroku.com/articles/getting-started-with-nodejs#declare-process-types-with-procfile


###　Create a free MongoDB account ###

Put the  mongolab plugin with :

```
heroku addons:add mongolab

var mongoUri = process.env.MONGOLAB_URI ||
  process.env.MONGOHQ_URL ||
  'mongodb://localhost/mydb';
```

> more details here : https://devcenter.heroku.com/articles/getting-started-with-nodejs#using-mongodb