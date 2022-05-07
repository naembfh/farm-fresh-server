const express = require('express');
const app=express();
var cors = require('cors')
const port=process.env.PORT || 5000;
require('dotenv').config()

// qqyABvJ8pqr3OXJm

// middleware
app.use(cors())
app.use(express.json())


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const { query } = require('express');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.jvvxj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        await client.connect();
 const vegeCollection = client.db("vegeShop").collection("vegetables");
//  load data
app.get('/vegetable',async(req,res)=>{
    const query={}
    const cursor=vegeCollection.find(query)
    const result=await cursor.toArray()
    res.send(result)
})
 app.get('/vegetable/:id',async(req,res)=>{
     const id=req.params.id
    //  console.log(id)
     const query={_id:ObjectId(id)}
     const result=await vegeCollection.findOne(query)
     res.send(result)
 })

//  post data

app.post('/vegetable',async(req,res)=>{
    const newVege=req.body;
const result=await vegeCollection.insertOne(newVege)
console.log(result)
res.send(result)

})

// update quantity
app.put('/vegetable/:id',async(req,res)=>{
    const id=req.params.id
    const updateQuantity=Number(req.body)
 console.log(updateQuantity)
    const filter={_id:ObjectId(id)}
    const options = { upsert: true }
    const updateDoc = {
        $set: {
          quantity:updateQuantity
        },
      };
      const result=await vegeCollection.updateOne(filter,updateDoc,options)
      res.send(result)

})

// delete 
app.delete('/vegetable/:id',async(req,res)=>{
    const id=req.params.id
    const query={_id:ObjectId(id)}
    const result=await vegeCollection.deleteOne(query)
    res.send(result)
})

    }
    finally{

    }
}
run().catch(console.dir);






app.get('/',(req,res)=>{
    res.send('vege lover')
})
app.listen(port,()=>{
    console.log('I am listening',port)
})