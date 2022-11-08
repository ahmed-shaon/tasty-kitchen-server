const express = require('express');
const cors = require('cores');
const app = express();
const port = process.env.PORT || 5000;

//middle wares 
app.use(cors());
app.use(express.json());


//main route
app.get('/', (req, res) => {
    res.send('khub-tast server is running.');
})


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})