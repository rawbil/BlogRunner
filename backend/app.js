const express = require('express');
const app = express();
require('dotenv').config({path: "./config/.env"});
const PORT = process.env.PORT || 5000;
const cors = require('cors')
//routes
const authRoute = require('./routes/authRoute');
const blogsRoute = require('./routes/blogsRoute');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODBURI)
.then(() => console.log(`Database Connnected: ${mongoose.connection.host}`))
.catch(error => console.log(error));

//END OF IMPORTS

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
//routes
app.use('/auth', authRoute);
app.use('/blogs', blogsRoute);

//test route
app.use('/', (req, res) => {
    res.send("Hi honey, welcome home!");
})

//error page
app.use((req, res) => {
    res.send("404 error... Not Found");
})

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost: ${PORT}`);
})