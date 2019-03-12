var cors = require("cors");
var express = require("express");
var md5 = require('md5');
var app = express();
var port = 3000;
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({extended: false});
var database = "mongodb://localhost:27017/test";
var mongoose = require("mongoose");
//var objectId = require("mongoose").ObjectID;

mongoose.Promise = global.Promise;
mongoose.connect(database);

var CoordinateSchema = new mongoose.Schema
({
	// _id: {
	// 	type: mongoose.Schema.Types.ObjectId,
	// 	index: true,
	// 	required: true,
	// 	auto: true,
	//   },

	description: String,
	address: String,
	phone: String,
	lat: String,
	lng: String,
	status: String,
	website: String,
	created_at: String,
	//type: mongoose.Schema.Types.Mixed
	type: {
		id: String,
		icon: String
	},
	user: {
		username: String,
		short_name: String,
		full_name: String
	}
	
},{versionKey: false});

var TypeSchema = new mongoose.Schema({
    icon: String,
    description: String
},{versionKey: false});

var UserSchema = new mongoose.Schema({
	username: String,
	short_name: String,
	full_name: String,
	status: String,
	dateCreated: String,
	lastUpdate: String,
	email: String,
	phone: String,
	login: String,
	password: String
},{versionKey: false});

var Coordinate = mongoose.model("Coordinate", CoordinateSchema);
var User = mongoose.model("User", UserSchema);
var Type = mongoose.model("Type",TypeSchema);

const util = require('util');

app.use(cors());
app.use(bodyParser.json());
app.listen(port, () => {
	console.log("CiCo is listening on port " + port);
});


app.get("/", (req, res) => {
	res.setHeader('Access-Control-Allow-Origin','*');
	res.send("Welcome to CiCo! developed by CajuIdeas.");
});


/* COORDENADAS */
app.post("/coordinate/add", urlencodedParser, (req, res) => {
	var newCoordinate = new Coordinate(req.body);
	console.log("[headers]: \n"+req.headers+"\n\n");
	console.log("[body]: \n"+req.body+"\n\n");
    console.log("[new coordinate added] \n"+newCoordinate+"\n\n");
	//Coordinate.create(newCoordinate);	//same bellow	
	newCoordinate.save()
		.then(item => {
			res.setHeader('Access-Control-Allow-Origin','*'); //it line is required by CORS policy
			res.send(newCoordinate);
		})
		.catch(err => {
			res.setHeader('Access-Control-Allow-Origin','*');			
			res.status(400).send(err);
		}); 
});

app.post("/coordinate/update", urlencodedParser, (req, res) => {
	var updatedCoordinate = new Coordinate(req.body);

	Coordinate.updateOne({"_id":req.body._id},{$set:updatedCoordinate}, (err,result) =>
	{
		console.log("[coordinate updated]\n"+updatedCoordinate+"\n\n");
	}).then(item => {
			res.setHeader('Access-Control-Allow-Origin','*');			
			res.send(updatedCoordinate);
		})
		.catch(err => {
			res.setHeader('Access-Control-Allow-Origin','*');			
			res.status(400).send(err);
		}); 
});

app.get("/coordinate", (req, res) => {
	console.log("listing all coordinates.");	
	Coordinate.find({}, (err,pontos) => {
		var lista = {};
			pontos.forEach(ponto => {
				lista[ponto._id] = ponto;
			});
		if (err) {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(err);
		} else {
			//res.json(pontos);
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(pontos);
		}		
	})
});

app.post("/coordinate", urlencodedParser, (req, res) => {
	Coordinate.findById({"_id":req.body.id},(err,ponto) => {
		if (err) {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(err);
		} else {
			//console.log(ponto);
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(ponto);
		}		
	});
});

/* ATENÇÃO */
/* REMOVER ABAIXO */
app.get('/coordinate/delete', (req, res, next) => {  
	// Coordinate.deleteMany({},(err) => {		
	// 	if (err) {
	// 		res.send(err);
	// 	} else {
	// 		res.send("done");
	// 	}
	// });
	Coordinate.deleteMany({},(err,result) => {
		if (err) {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(err);
		} else {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(result);
		}
	});
});  
	 
app.post('/coordinate/delete', function(req, res, next) {  
	var id = req.body.id;  
	console.log('[deletion]\nid: '+id);
	Coordinate.findByIdAndRemove(id, (err,result) => {
		if (err) {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(err);
		} else {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(result);
		}
	});  
	//res.redirect('/');  
});



/*
https://mongoosejs.com/docs/api.html

npm i mongoose
npm i express

mongodb database: test
collection: coordinates
	show collections
	db.getCollections()

json exemplo:
{
	"id": "xyz",
	"description": "xyz",
	"address": "xyz",
	"phone": "xyz",
	"website": "xyz",
	"lat": "xyz",
	"lng": "xyz",
	"status": "xyz",
	"type": {
		"id": "xyz",
		"icon": "xyz"
	}
}
*/
/* USUARIOS */

app.post("/user/add", urlencodedParser, (req, res) => {
	
	console.log(JSON.stringify(req.body));
	console.log("[headers]: \n"+JSON.stringify(req.headers)+"\n\n");
	console.log("[body]: \n"+JSON.stringify(req.body)+"\n\n");
	
	
	var newUser = new User(req.body.user);
	console.log("[new user added] \n"+JSON.stringify(newUser)+"\n\n");

	newUser.save()
		.then(item => {
			res.setHeader('Access-Control-Allow-Origin','*'); //it line is required by CORS policy
			res.send(newUser);
		})
		.catch(err => {
			res.setHeader('Access-Control-Allow-Origin','*');			
			//res.status(400).send(err);
			res.send("0");
		}); 
});

app.post("/user/update", urlencodedParser, (req, res) => {
	var updatedUser = new User(req.body);

	User.updateOne({"_id":req.body._id},{$set:updatedUser}, (err,result) =>
	{
		console.log("[user updated]\n"+updatedUser+"\n\n");
	}).then(item => {
			res.setHeader('Access-Control-Allow-Origin','*');			
			res.send(updatedUser);
		})
		.catch(err => {
			res.setHeader('Access-Control-Allow-Origin','*');			
			//res.status(400).send(err);
			res.send("0");
		}); 
});

app.get("/user", (req, res) => {
	//console.log("listing all.");	
	User.find({}, (err,usuarios) => {
		var lista = {};
			usuarios.forEach(usuario => {
				lista[usuario._id] = usuario;
			});
		if (err) {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(err);
		} else {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send("adicionado: "+usuario);
		}		
	})
});

app.post("/user/login", urlencodedParser, (req, res) => {
	console.log(req.body);
	console.log(req.body.login);
	console.log(req.body.password);
	
	
	User.findOne({"login":req.body.login,"password":md5(req.body.password)},(err,usuario) => {
		if (err) {
			res.setHeader('Access-Control-Allow-Origin','*');
			//res.send(err);
			res.send("0");
		} else {
			res.setHeader('Access-Control-Allow-Origin','*');
			// console.log("usuario: "+JSON.stringify(usuario));
			res.send("localizado: "+usuario);			
		}		
	});
});

/* ATENÇÃO */
/* REMOVER ABAIXO */
app.get('/user/delete', (req, res, next) => {  
	User.deleteMany({},(err,result) => {
		if (err) {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(err);
		} else {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(result);
		}
	});
});  
	 
app.post('/user/delete', function(req, res, next) {  
	var id = req.body.id;  
	console.log('[deletion]\nid: '+id);
	User.findByIdAndRemove(id, (err,result) => {
		if (err) {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(err);
		} else {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(result);
		}
	});  
	//res.redirect('/');  
});

/*
{
	"username": "String",
	"short_name": "String",
	"full_name": "String",
	"status": "String",
	"created_at": "date",
	"last"
	"login": "String",
	"password": "String"
}

*/

app.get("/type", (req, res) => {
	console.log("listing all types.");	
	Type.find({}, (err,types) => {
		var lista = {};
			types.forEach(tp => {
				lista[tp._id] = tp;
			});
		if (err) {
			console.log(err);
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(err);
		} else {
			//res.json(pontos);
			console.log(JSON.stringify(types));
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(types);
		}		
	})
});

app.post("/type/add", urlencodedParser, (req, res) => {
	
	console.log(JSON.stringify(req.body));
	console.log("[headers]: \n"+JSON.stringify(req.headers)+"\n\n");
	console.log("[body]: \n"+JSON.stringify(req.body)+"\n\n");
	
	
	var newType = new Type(req.body.type);
	console.log("[new type added] \n"+JSON.stringify(newType)+"\n\n");

	newType.save()
		.then(item => {
			res.setHeader('Access-Control-Allow-Origin','*'); //it line is required by CORS policy
			res.send(newType);
		})
		.catch(err => {
			res.setHeader('Access-Control-Allow-Origin','*');			
			//res.status(400).send(err);
			res.send("0");
		}); 
});