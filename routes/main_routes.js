const express = require("express");
const app = express();

app.get('/', (req,res)=> {
    res.send('hello world');
});

app.use('/user', require('./user_routes'));
app.use('/menu', require('./menu_routes'));

module.exports = app;