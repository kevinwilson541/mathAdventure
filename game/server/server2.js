var mongoose = require('mongoose'),
    fs = require('fs'),
    express = require('express'),
    http = require('http'),
    port = process.env.PORT || 4560,
    app;

app = express();

var dboptions = {
user: "mathadmin",
pass: "mathadventurecis399",
server: {
	ssl: true,
    sslValidate: false,
	auto_reconnect: true,
	sslCert: fs.readFileSync('/home/users/kwilson8/.ssl/mongodb-cert.crt'),
	sslKey: fs.readFileSync('/home/users/kwilson8/.ssl/mongodb-cert.key') 
	}
};

var dbconnect = "mongodb://localhost:4184/admin";
mongoose.connect(dbconnect, dboptions);

var weboptions= { key: fs.readFileSync('/home/users/kwilson8/.ssl/agentkey.pem'),
		  cert: fs.readFileSync('/home/users/kwilson8/.ssl/agentcert.crt')
	      };

var server = http.createServer(app);
server.listen(port, function () {
	console.log("connected to server");
}); 

mongoose.connection.on('connected', function () {
     console.log('Mongoose connected');
});

mongoose.connection.on('error',function (err) {
     console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function () {
     console.log('Mongoose disconnected');
});



app.use(express.urlencoded());  //this allows req.body

// set up a static file directory to use for default routing
app.use(express.static(__dirname + "/../"));
app.use(express.cookieParser('l337'));

var cookie_options = {'signed': true,
                      'expires': 0};

// other options:
//httpOnly
//secure 

//schemas (see http://mongoosejs.com/docs/3.6.x/docs/schematypes.html)

var UserSchema = mongoose.Schema({   user: String,
                                     password: String,
                                     compromised: [String],
				     state: Object});
// added object
var User = mongoose.model("User", UserSchema);

//routes for login page

app.get("/", function (req, res) {
	console.log("connection to " + req);
	res.sendfile("./index.html");
	});


app.get("/login.json", loginHandler);

app.post("/register.json", registerHandler);

app.post("/save", postSaveState);

app.get("/retrieve", getSaveState);

//route handlers - should refactor into separate files

function getSaveState(req, res) {
  console.log("the cookie on get", req.signedCookies);
  var user = req.signedCookies.user; // gets user cookie
  if (user) {
    res.cookie('user', user, cookie_options);	// sets user cookie
    User.findOne({'user': user}, function (err, data) {
        if (err) res.json({'error': err});
        else {
            console.log(data);
            if (data.state) res.json(data.state);
            else res.json({});
        }
    });
  } else {
    res.clearCookie('user');
    res.json({'url': './index.html'}); // cookie didn't exist (why you trying to hack me bro)
  }   
}

function postSaveState(req, res) {
  console.log("the cookie on post", req.signedCookies);
  var user = req.signedCookies.user;
  if (user) {
    console.log("requested " + JSON.stringify(req.body));
    res.cookie('user', user, cookie_options);
    User.update({'user': user}, {$set: {state: req.body}}, function (err, data) {
        if (err) {
            console.log(err);
            res.json({'err': err});
        }
        else {
            res.json({'state': 'Saved data successfully'});
        }
    });
  } else {
    res.clearCookie('user');
    res.json({'url': './index.html'});
  }
}

function registerHandler(req, res) {
  var the_body = req.body;
  console.log(the_body);
  User.findOne({'user': the_body.name}, function(err, result) {
    if (err)
        return console.log(err);
    if (result)
      res.json({'err': 'User is already in database'});
    else
      var user = new User({'user': the_body.name, 'password': the_body.password});
      user.save(function (err, data) {
        if (err)
          console.log(err);
        else {
          console.log("inserted into db ", data);
          res.json({'user': the_body.name, 'password': the_body.password});
        }
      });
  });
}

function loginHandler(req, res) {
  var the_body = req.query;
  console.log('login request ', the_body);
  middleLogin(the_body, function (answer) {
    console.log('answer ', answer);
    // answer.name and answer.password bools
    if (answer.name !==true || answer.password !== true) {
      res.json(answer);
    } else {
      res.cookie('user', the_body.name, cookie_options);
      res.json({'url': '/part9.html'});
    }
  });
}

function middleLogin(login, callback){
  mongoCheckExistence(login, function (result) {
    if (result.err) 
      callback({'err': result.err});
     else 
      callback(result);
  });
}

function mongoCheckExistence(login, callback) {
  var name = login.name;
  var password = login.password;
  User.findOne({'user': name}, function(err, result) {
    console.log('existence result ', result);
    if (err) {
      console.log('existence error ', err);
      callback({'err': err});
      return;
    }
    if (result) {
      if (result.password === password) 
        callback({'name': true, 'password': true});
       else 
        callback({'name': true, 'password': false});
    } else { 
      callback({'name': false, 'password': false});
    }
  });
}

process.on('SIGINT', function() {
       mongoose.connection.close();
       server.close();
       process.exit(0);
     });
