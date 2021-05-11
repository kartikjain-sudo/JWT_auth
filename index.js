const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//Import Routes
const authRoute = require('./routes/auth');

dotenv.config();

const app = express()
const PORT = process.env.PORT || 3000;

mongoose.connect(process.env.mongoose_url,{
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true, }, () => {
    console.log("Connected to DB");
})

//Middlewares
app.use(express.json());

app.use('/', authRoute );

app.listen(PORT, (req, res) => {
    console.log(`${PORT} server up and running`);
})