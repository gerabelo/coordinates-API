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

var UserSchema = new mongoose.Schema({
	username: String,
	short_name: String,
	full_name: String,
	status: String,
	dateCreated: Date,
	lastUpdate: Date,
	email: String,
	phone: String,
	login: String,
	password: String
})

var Coordinate = mongoose.model("Coordinate", CoordinateSchema);
var User = mongoose.model("User", UserSchema);

const util = require('util');

app.use(cors());
app.use(bodyParser.json());
app.listen(port, () => {
	console.log("Coordinates CRUD is listening on port " + port);
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

app.get("/", (req, res) => {
	res.setHeader('Access-Control-Allow-Origin','*');
	res.send("Coordinates CRUD by CajuIdeas");
});

app.get("/coordinate", (req, res) => {
	//console.log("listing all.");	
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
	var newUser = new User(req.body);
	console.log("[headers]: \n"+req.headers+"\n\n");
	console.log("[body]: \n"+req.body+"\n\n");
	console.log("[new user added] \n"+newUser+"\n\n");
	
	newUser.save()
		.then(item => {
			res.setHeader('Access-Control-Allow-Origin','*'); //it line is required by CORS policy
			res.send(md5(newUser.password)); //retorna o md5 do md5 da senha texto pleno, gerado no cliente e submetido à api.
		})
		.catch(err => {
			res.setHeader('Access-Control-Allow-Origin','*');			
			res.status(400).send(err);
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
			res.status(400).send(err);
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
			res.send(pontos);
		}		
	})
});

app.post("/user/login", urlencodedParser, (req, res) => {
	User.findOne({"login":req.body.login,"password":req.body.password},(err,usuario) => {
		if (err) {
			res.setHeader('Access-Control-Allow-Origin','*');
			//res.send(err);
			res.send("0");
		} else {
			res.setHeader('Access-Control-Allow-Origin','*');
			res.send(md5(usuario.password)); //retorna o md5 do md5.
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