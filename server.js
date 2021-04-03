const express = require('express');
require('dotenv').config;

const app = express();

app.get('/public', function(req, res) {
    var currentDate = new Date(); 
    var currentTime = `${currentDate.getHours()}:${currentDate.getMinutes()}:${currentDate.getSeconds()}`;
    res.json({
        message: currentTime
    })
})

app.listen(3001);
console.log("API server listening on " + process.env.API_URL);