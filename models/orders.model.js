const mongoose = require("mongoose")

const schema = mongoose.Schema({
	side: String,
	price: Number,
})

module.exports = mongoose.model("Orders", schema)