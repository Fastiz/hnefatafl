# Hnefatafl

## About
Simple personal project for trying out the combination of typescript, web sockets and rxjs.  
The project itself is for matchmaking and playing an old viking's tabletop game called 'Hnefatafl' (the one that is played in some scenes of [Vikings series](https://www.wikiwand.com/en/Vikings_(2013_TV_series))).  
[Link to game rules](http://aagenielsen.dk/fetlar_rules_en.php)

## Project content
The project is a single repository for the frontend and backend and a simple docker-compose file for easy deployment.

### About the frontend
The frontend was made in React with the following principal dependencies:  
* redux
* redux-observable
* rxjs
* socket.io-client
* react-dnd

### About the backend
The backend is made in typescript with the following principal dependencies:
* express
* lodash
* rxjs
* socket.io

## Demo
At the current date the project is running in a digitalocean droplet behind an nginx proxy.  
[hnefatafl.fastiz.dev](https://hnefatafl.fastiz.dev/)


