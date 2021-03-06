const express = require('express');		// Importing the express package
const mongoose = require("mongoose");
const ordersControllers = require('./controllers/orders.controller');		

const app = express();		// Instantiating express
app.use(express.json());	

app.use('/',ordersControllers);

// Application level error handling 
app.use(function (err, req, res, next) {
    console.error(err.stack)
    res.status(500).send('Server Error!')
  })

// Connect to MongoDB database
mongoose
	.connect("mongodb://localhost:27017/exchangedb", { useNewUrlParser: true })
	.then(() => {
	  //Start server on port 5000
		app.listen(5000, () => {
			console.log("Node.js web server running at port 5000!")
		})
	})
