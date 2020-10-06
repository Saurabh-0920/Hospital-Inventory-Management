
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

//Fetching Details Of All Hospitals 
app.get('/hospitalDetails', middleware.checkToken, async(req,res)=>{
    try{
    console.log("Getting Data From Hospital Collection")
    var data=db.collection('hospital').find().toArray().then(result => res.json(result))
    }
    catch(err)
    {
        res.send('Error ' + err)
    }
})

//Fetching Details Of All Ventilators 
app.get('/ventilatorDetails',  middleware.checkToken, async(req,res)=>{
    try{
    console.log("Getting Data From Ventilator Collection")
    var data=db.collection('ventilator').find().toArray().then(result => res.json(result))
    }
    catch(err)
    {
        res.send('Error ' + err)
    }
})

//To Search Ventilators With Given Status
app.post('/searchVentilatorByStatus', middleware.checkToken, async(req,res)=>{
    try{
    console.log(req.body.status)
    var ventilatorWithGivenStatus=db.collection('ventilator').find({"status":req.body.status}).toArray().then(result => res.json(result))
    }
    catch(err)
    {
        res.send('Error ' + err)
    }
})

//To Search Ventilators With Given Hospital Name
app.post('/searchVentilatorByName', middleware.checkToken, async(req,res)=>{
    try{
    console.log(req.query.name)
    var ventilatorWithGivenName=db.collection('ventilator').find({"name":new RegExp(req.query.name,'i')}).toArray().then(result => res.json(result))
    }
    catch(err)
    {
        res.send('Error ' + err)
    }
})

//Searching Hospitals By Name
app.post('/searchHospitalByName', middleware.checkToken, async(req,res)=>{
    try{
    console.log(req.query.name)
    var ventilatorWithGivenName=db.collection('hospital').find({"name":new RegExp(req.query.name,'i')}).toArray().then(result => res.json(result))
    }
    catch(err)
    {
        res.send('Error ' + err)
    }
})

//Update Status Of A Ventilator 
app.put('/updateVentilatorStatus',  middleware.checkToken, async(req,res)=>{
    try{
      var ventid={ventilatorId:req.body.ventilatorId}
      console.log(ventid)
      var updated_status={$set: {status : req.body.status}}
      db.collection('ventilator').updateOne(ventid,updated_status ,function(err,result){
          res.json("1 Document Has Been Updated")
      })
    }
    catch(err)
    {
        res.send('Error ' + err)
    }
})

//Add New Ventilator Details
app.post('/addVentilator',  middleware.checkToken, async(req,res)=>{
    try{
      var new_entry=
      {
        hId : req.body.hId,
        ventilatorId : req.body.ventilatorId,
        status : req.body.status,
        name : req.body.name

      }

      db.collection('ventilator').insertOne(new_entry,function(err,result){
          res.json("Item Inserted Successfully !")
      })

      
    }
    catch(err)
    {
        res.send('Error ' + err)
    }
})

//Delete Ventilator Details
app.delete('/deleteVentilator', middleware.checkToken, async(req,res)=>{
    try{
      var given_query=req.query.ventilatorId
      console.log(given_query)
    
      var to_delete={ventilatorId:given_query}
      db.collection('ventilator').countDocuments(to_delete,function(err,count){
           if(count>0)
           {
            db.collection('ventilator').deleteOne(to_delete,function(err,obj)
            {
                res.json("Item Deleted Successfully !")
            })
           }
           else{
                res.json("Given Ventilator Not Found")
           }
      })
      
    }
    catch(err)
    {
        res.send('Error ' + err)
    }
})


app.listen(3000,function() {
    console.log("Server Is At Port: 3000");
  });