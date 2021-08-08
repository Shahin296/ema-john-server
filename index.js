const express = require("express");
const { MongoClient } = require('mongodb');
require('dotenv').config();
const bodyParser = require("body-parser");
const cors = require("cors")

const app = express();
app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}));

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.60vos.mongodb.net/emaJohnStore?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });



client.connect(err => {
  const productCollection = client.db("emaJohnStore").collection("products");
 
  app.post("/addProduct", (req, res)=>{
    const product = req.body;
    productCollection.insertOne(product)
    .then(result => {
        console.log(result.insertedCount)
        res.send(result.insertedCount)
    })
  })

  app.get("/products", (req, res)=>{
     productCollection.find({}).limit(20)
     .toArray((err, documents)=>{
         res.send(documents)
     }) 
  })
  
  console.log("connected")
  
});

app.listen(process.env.PORT || 5000)