// 'use strict'
// const pg = require('pg');
// const client = new pg.Client(process.env.DATABASE_URL)
// const Client =  require('pg').Client

const {Client} =  require('pg');
console.log('Client',Client);

// const client =new Client({
//   user:'postgres',
//   password:'1234',
//   port: 5432,
//   database:'chart',
//   // host:'localhost',
// });
console.log('hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee');
const connectionString='postgressql://postgres:1234@localhost:5432/penguinin';
const client =new Client({
  connectionString:connectionString,
});
// console.log("client",client)
module.exports=client;