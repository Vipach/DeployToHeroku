const express = require('express')
const hbs = require('hbs')

const app = express()
app.set('view engine','hbs')

var bodyParser = require("body-parser");
const { ObjectId } = require('mongodb');
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/',(req,res)=>{

    res.render('index')
})

var MongoClient = require('mongodb').MongoClient;
var url =  "mongodb+srv://bachquangviet:viet123456789@cluster0.l0dxq.mongodb.net/test";

app.get('/insert',(req,res)=>{
    res.render('insert')
})
app.post('/doInsert', async (req,res)=>{
    var nameInput = req.body.txtName;
    var priceInput = req.body.txtPrice;
    var newProduct = {name:nameInput, price:priceInput}
    var client= await MongoClient.connect(url);
    var dbo = client.db("Zito");
    await dbo.collection("SanPham").insertOne(newProduct);
    res.redirect('/view');
})

app.get('/view',async (req,res)=>{
    var client= await MongoClient.connect(url);
    var dbo = client.db("Zito");
    var results= await dbo.collection("SanPham").find({}).toArray();
    res.render('allProduct',{model:results})
})
app.post('/search', async (req,res)=>{
    const searchText = req.body.txtName;
    var client= await MongoClient.connect(url);
    var dbo = client.db("Zito");
    const searchCondition = new RegExp(searchText,'i');
    const results =  await dbo.collection("SanPham").find({name:searchCondition}).toArray();
    res.render('allProduct',{model:results})
})

app.get('/delete',async (req,res)=>{
    const id = req.query.id;
    var ObjectID = require('mongodb').ObjectID;
    const condition = {"_id" : ObjectId(id)};

    const client= await MongoClient.connect(url);
    const dbo = client.db("Zito");
    const productToDelete = await dbo.collection("SanPham").findOne(condition);
    await dbo.collection("SanPham").deleteOne(condition);
    res.redirect('/view');
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log("Server is running: " + PORT);
