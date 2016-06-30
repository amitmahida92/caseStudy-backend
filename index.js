var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
   
}));

//App setting header configuring
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");   
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header('Access-Control-Allow-Credentials', true);    
    next();
});

app.get('/', function (req, res, next) {
    res.send("App Running Successfully");
    next();
})


var mongoose = require('mongoose');
mongoose.connect('mongodb://172.16.7.101/CaseStudyDB')


var loginApi = require('./api/login/loginRoute.js')(app);
var caseStudyApi = require('./api/case-study/caseStudyRoute.js')(app);


app.set('port',  3008);
app.set('ip', "172.16.3.190");

var server = app.listen(app.get('port'), app.get('ip'), function () {
        console.log(" Express Server is listening on " + app.get('ip') + ':' + app.get('port'));
    }
);