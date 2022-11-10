const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middle wares 
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4dokkij.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run(){
    try{
       const menuCollection = client.db("tastyKitchen").collection("menu");
       const reviewCollection = client.db("tastyKitchen").collection("reviews");

        app.get('/menu',async (req, res) => {
            const query = {};
            let menu;
            const cursore = menuCollection.find(query);
            console.log(menu);
            if(req.query.home)
            {
                menu = await cursore.limit(3).toArray();
            }
            else{
                menu = await cursore.toArray();
            }
            res.send(menu);
        })

        app.get('/menu/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id:ObjectId(id)}
            const item =await menuCollection.findOne(query);
            res.send(item);
        })

        app.get('/reviews', async(req, res) => {
            let query = {};
            if(req.query.id)
            {
                
                query = {itemId:req.query.id};
            }
            if(req.query.email)
            {
                query= {email:req.query.email}
            }
            const cursore = reviewCollection.find(query);
            const reviews = await cursore.toArray();
            res.send(reviews);
        })

        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.put('/reviews/:id', async (req,res) => {
            const id= req.params.id;
            const review = req.body;
            const  filter = {_id:ObjectId(id)};
            const option= {upsert:true};
            const doc={
                $set:{
                    rating:review.rating,
                    message:review.message
                }
            }
            const result = await reviewCollection.updateOne(filter, doc, option)
            res.send(result);
        })

    }
    finally{

    }
}
run().catch(err => console.log(err))


//main route
app.get('/', (req, res) => {
    res.send('khub-tast server is running.');
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})