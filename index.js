const express = require('express');
const cors = require('cors');
// const dotenv = require('dotenv')
const { MongoClient, ServerApiVersion, ObjectId} = require('mongodb');
const app = express();
// const {dbConnect} = require('./config/dbConnect')
require('dotenv').config();
const port = process.env.PORT || 5000;

// dbConnect()

app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5is5e.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

  
 
async function run(){
try{
await client.connect();
const todoCollection = client.db("task_managment").collection("Todo");

app.get('/Todo', async (req, res) => {
    const query = {};
    const cursor = todoCollection.find(query);
    const parts = await cursor.toArray();
    res.send(parts);
});
app.post('/Todo', async (req, res) => {
    const NewTask = req.body;
    console.log(NewTask)
    const result = await todoCollection.insertOne(NewTask);
    res.send(result)
})
app.get('/Todo/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const part = await todoCollection.findOne(query);
    res.send(part)
})
app.delete('/Todo/:id', async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const result = await todoCollection.deleteOne(query);
    res.send(result)
})
app.put("/Todo/:id", async (req, res) => {
    const id = req.params.id;
    const updatedStock = req.body;
    const filter = { _id: ObjectId(id) };
    const options = { upsert: true };
    const updateDocument = {
        $set: updatedStock
    };
    const result = await todoCollection.updateOne(
        filter,
        updateDocument,
        options
    );
    console.log("updating", id);
    res.send(result);
});
}
finally{

}
}
run().catch(console.dir)
app.get('/', (req, res) => {
    res.send('server is connected')
})

app.listen(port, () => {
    console.log('listening to the port', port)
})