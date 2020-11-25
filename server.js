'use strict';

// Load environment variables from .env
require('dotenv').config();
const client = require('./DBconection.js');
// Application dependencies
const express = require('express');
const bodyParser = require('body-parser');
const superagent = require('superagent');
// const cors = require('cors');
// const pg = require('pg');
// Application setup
const PORT = process.env.PORT || 4000;
const server =  express();
// server.use(cors('/'));
server.set('view engine','ejs');
server.use(express.static('./public'));
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({ extended: true }));

server.post('/shortestpath',(request,response) => {
  superagent
    .post('http://82.212.107.181:8090/PenNav_API/PathAPI.svc/getPathToPoI')
    .send(request.body)
    .set('accept', 'json')
    .end(function (err, result) {
      console.log(result.body,'res.body');
      response.send(result.body);
    });
});

server.post('/edges',function(request,response){
  superagent
    .post('http://82.212.107.181:8090/PenNav_API/DataAPI.svc/GetFloorsEdges')
    .send(request.body) // sends a JSON post body
    .set('accept', 'json')
    .end(function (err, result) {
      console.log(result.body,'res.body');
      response.send(result.body);
    });
});

server.post('/gitallpoi',function(request,response){
  superagent
    .post('http://82.212.107.181:8090/PenNav_API/DataAPI.svc/GetPoIByFloor')
    .send(request.body) // sends a JSON post body
    .set('accept', 'json')
    .end(function (err, result) {
      console.log(result.body,'res.body');
      response.send(result.body);

    });
});

server.get('/', (req,res)=>{
  // client.query('select * from users')
  res.render('./index',{names:'names',attend:'attend' });
});

client.connect()
  .then(()=>{
    server.listen(PORT, () => console.log(`App is listening on ${PORT}`,Date()));
  })
// .catch(e => {console.log(e);});
  .then(()=> console.log('Connected Successfully'))
  .catch(e=>console.log(e));

server.use('*',(req,res)=>{
  res.status(404).send('Sorry! something went wrong :*(');
});

