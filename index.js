const express = require("express");
const app = express();
const cors = require("cors");
require("./config/database");
const mainRoute = require("./routes/main_routes");
require('dotenv').config()
const logger = require('./middleware/logging_middleware');
const path = require('path'); // Add this line to import the path module

//Project middleware
app.use(cors());
app.use(express.json());

app.set('view engine', 'ejs'); // Set EJS as the view engine
app.set('views', path.join(__dirname, 'views')); // Set the directory for views (optional)


//Project Routes
app.get('/', (req, res) =>{
    res.send('Hello World')
})
app.use('/v1/', mainRoute)

//Publich public folder
app.use(express.static('public'));

const server = app.listen(process.env.PORT, function () {
    console.log("backend server is running on port : " + (process.env.PORT));
    logger.info(`Server started and running on ${process.env.PORT}`)
});