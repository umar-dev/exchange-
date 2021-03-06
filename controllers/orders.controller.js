var express = require('express');
var router = express.Router();
const redis = require("redis");

const BinarySearchTree = require("binary-search-tree").BinarySearchTree
const publisher = redis.createClient();
var Orders   = require('../models/orders.model');

const kafka = require('kafka-node');
const config  = require('./config');

const client = new kafka.KafkaClient({kafkaHost: config.KafkaHost});
const producer = new Producer(client,  {requireAcks: 0, partitionerType: 2});

client.on("error", function(error) {

    throw(error);
});



// GET Route - READ
router.get("/api/orders/:side/:price", async (req, res) => {
    let bst = new BinarySearchTree({  });
    let price = req.params.price; 
    let side = req.params.side;
	let orderslist = await Orders.find()
    orderslist.forEach(element => {
     //create Binary Tree of Order 
    bst.insert(element.price,element);  
    });

    //publish order on RedisChannel 
    publisher.publish("orders",{
		side:side,
		price: price
	   } , function(){
        process.exit(0);
       });

   //push order on kafa  
    pushDataToKafka({
            side:side,
            price: price
    });   
})

// POST Route - CREATE
router.post("/api/orders", async (req, res) => {
	const order = new Orders({
		side: req.body.side,
		price: req.body.price
	})
       await order.save()
       res.send(order)

})

const pushDataToKafka =(dataToPush) => {

    try {
    let payloadToKafkaTopic = [{topic: config.KafkaTopic, messages: JSON.stringify(dataToPush) }];
    console.log(payloadToKafkaTopic);
    producer.on('ready', async function() {
      producer.send(payloadToKafkaTopic, (err, data) => {
            console.log('data: ', data);
    });
  
    producer.on('error', function(err) {
      //  handle error cases here
    })
    })
    }
  catch(error) {
    console.log(error);
  }
  
  };

module.exports = router;