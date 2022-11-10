const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

//middle wares 
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.4dokkij.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

function verifyJwt(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).send({ message: 'unauthorized access' });
    }
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
        if (err) {
            return res.status(401).send({ message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        const menuCollection = client.db("tastyKitchen").collection("menu");
        const reviewCollection = client.db("tastyKitchen").collection("reviews");

        app.get('/menu', async (req, res) => {
            const query = {};
            let menu;
            const cursore = menuCollection.find(query).sort({ _id: -1 });
            console.log(menu);
            if (req.query.home) {
                menu = await cursore.limit(3).toArray();
            }
            else {
                menu = await cursore.toArray();
            }
            res.send(menu);
        })

        app.get('/menu/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const item = await menuCollection.findOne(query);
            res.send(item);
        })

        app.get('/reviewsbyid', async (req, res) => {
            const id = req.query.id;
            console.log(id);
            const query = { itemId: id };
            const cursore = reviewCollection.find(query).sort({ date: 1 });
            const reviews = await cursore.toArray();
            res.send(reviews);
        })

        app.get('/reviews', verifyJwt, async (req, res) => {
            const decoded = req.decoded;
            // console.log(decoded);
            if (decoded.email !== req.query.email) {
                return res.send({ message: 'unauthorized access' })
            }
            const query = { email: req.query.email }
            const cursore = reviewCollection.find(query);
            const reviews = await cursore.toArray();
            res.send(reviews);
        })
        

        app.post('/review', async (req, res) => {
            const review = req.body;
            const result = await reviewCollection.insertOne(review);
            res.send(result);
        })

        app.post('/menu', async (req, res) => {
            const item = req.body;
            const result = await menuCollection.insertOne(item);
            res.send(result);
        })

        //jwt token
        app.post('/jwt', async (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: '10h' })
            res.send({ token });
        })

        app.put('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const review = req.body;
            const filter = { _id: ObjectId(id) };
            const option = { upsert: true };
            const doc = {
                $set: {
                    rating: review.rating,
                    message: review.message
                }
            }
            const result = await reviewCollection.updateOne(filter, doc, option)
            res.send(result);
        })

        app.delete('/reviews/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await reviewCollection.deleteOne(query);
            res.send(result);
        })

    }
    finally {

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