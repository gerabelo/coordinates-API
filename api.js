var express = require("express");
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
//app.use(bodyParser.urlencoded({extended:true}));
var urlencodedParser = bodyParser.urlencoded({extended: false});
app.use(bodyParser.json());

var database = "mongodb://localhost:27017/test";
var mongoose = require("mongoose");
var objectId = require("mongoose").ObjectID;

mongoose.Promise = global.Promise;
mongoose.connect(database);

var Schema = new mongoose.Schema
({
	_id: String,
	description: String,
	address: String,
	lat: String,
	lng: String,
	status: String,
//	type:[{type: String}]
	type: mongoose.Schema.Types.Mixed

});

var Coordinate = mongoose.model("Coordinate", Schema);

const util = require('util');

app.post("/ponto/add", urlencodedParser, (req, res) => {
	var newDoc = new Coordinate(req.body);
//	console.log("body: " + util.inspect(req.body, {showHidden: false, depth: null}));
	newDoc.save()
		.then(item => {
			res.send(req.body._id + " saved to database ");
		})
		.catch(err => {
			res.status(400).send("unable to save to database");
		}); 
});

app.post("/ponto/update", urlencodedParser, (req, res) => {
	var doc = new Coordinate(req.body);
	var id = req.body._id;

	Coordinate.updateOne({"_id":id},{$set:doc},function(err,result)
	{
		console.log(req.body._id + " updated.");
	}).then(item => {
			res.send(req.body._id + " updated to database ");
		})
		.catch(err => {
			res.status(400).send("unable to update to database");
		}); 
});



app.get("/", (req, res) => {
	res.send("Hello World");
});

app.get("/ponto", (req, res) => {
	Coordinate.find({}, (err,pontos) => {
		if (err) {
			res.send('something went wrong');
		}
		res.json(pontos);
	})
});

app.get("/ponto/:id", (req, res) => {
	Coordinate.findById(req.params.id)
	.then(ponto => {
		if (!ponto) {
			return res.status(404).end();
		}
		return res.status(200).json(ponto);
	})
});


app.listen(port, () => {
	console.log("Server listening on port " + port);
});


