
const express=require('express')
const app=express()

//for MongoDB
const MongoClient=require('mongodb').MongoClient
const url= 'mongodb://127.0.0.1:27017'
const dbName='hospitalInventory'

//Connecting server file for AWT
let server=require('./server')
let middleware=require('./middleware')

//BodyParser
const bodyParser=require('body-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

//Database Connection Using MongoDB
let db
MongoClient.connect(url,{useUnifiedTopology:true} , (err,client)=>{
    if(err) return console.log(err)
    db=client.db(dbName)
    console.log(`Connected MongoDB: ${url}`)
    console.log(`Database: ${dbName}`)
})