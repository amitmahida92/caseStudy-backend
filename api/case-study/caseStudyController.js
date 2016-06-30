module.exports.controller = function (app) {
    var csModel = require('./caseStudyModel');
    var techonologies = require('./technologiesModel');
    var multer = require("multer");
    var fs = require('fs');
    var Grid = require('gridfs-stream');
    var mongoose = require('mongoose');
    var conn = mongoose.connection;
    var upload = multer({ dest: "./server/CaseStudyUploads/" }).any();

    Grid.mongo = mongoose.mongo;

    conn.once('open', function () {
        console.log('open');
        gfs = Grid(conn.db);
    });

    return {
        index: function (req, res) {
            res.send("Index Called from caseStudy Controller");
        },
        getCaseStudies: function (req, res) {
            csModel.find({ "status": 1 })
                .sort({ 'created_on': 1 })
                .exec(function (err, data) {
                    if (err)
                        res.send(err);

                    res.json(data);
                });
        },
        getCaseStudy: function (req, res) {
            var id = req.query.id;
            if (id) {
                csModel.find({ "_id": id }, function (err, data) {
                    if (err)
                        res.send(err);

                    res.json(data);
                });
            }
        },

        addCaseStudy: function (req, res, next) {

            var casestudy = new csModel(req.body);
            casestudy.save(function (err, screen) {
                if (err) {
                    return next(err);
                }
                res.send({
                    "status": "OK",
                    "message": "Successfully Added!"
                });
            });
        },

        uploadFiles: function (request, response) {
            upload(request, response, function (err) {
                if (err) {
                    console.log('Error Occured');
                    return;
                }

                else {
                    // streaming to gridfs
                    //Creates a writable stream with the "filename"" to store in mongodb                
                    var writestream = gfs.createWriteStream({
                        filename: request.files[0].filename
                    });

                    //Pulls the data from  source file uploaded in Node Server and and writes it to the writable stream 
                    fs.createReadStream(request.files[0].destination + request.files[0].filename).pipe(writestream);

                    writestream.on('error', function (file) {
                        console.log("some error occured while writing stream")
                        return
                    });


                    writestream.on('close', function (file) {
                        console.log(request.files[0].filename + ' Written To DB');
                        // request.files is an object where fieldname is the key and value is the array of files 
                        file["originalFileName"] = request.files[0].originalname;
                        response.send(file);
                    });

                }
            });
        },


        readFiles: function (request, response) {


            //write content to file system
            var fs_write_stream = fs.createWriteStream('./server/CaseStudyUploads/' + request.query.fileName);

            //read from mongodb
            var readstream = gfs.createReadStream({
                filename: request.query.fileId
            });

            readstream.pipe(fs_write_stream);
            fs_write_stream.on('close', function () {

                var file = './server/CaseStudyUploads/' + request.query.fileName;
                response.download(file); // Set disposition and send it.
                // res.end(fileToSend);

                //console.log('file has been written fully!');
            });

        },



        editCaseStudy: function (req, res) {
            var newValue = req.body.newValue;
            var id = req.body.newValue._id;

            var conditions = { _id: id };

            csModel.update(conditions, newValue, callback);

            function callback(err, numAffected) {
                // numAffected is the number of updated documents
                if (err)
                    res.send(err);
                if (numAffected)
                    res.send({
                        "status": "OK",
                        "message": "Successfully Updated!"
                    });
            }

        },

        deleteCaseStudy: function (req, res) {
            var id = req.body.id;

            var conditions = { _id: id };

            csModel.update(conditions, { "status": 0 }, callback);

            function callback(err, numAffected) {
                // numAffected is the number of updated documents
                if (err)
                    res.send(err);
                if (numAffected)
                    res.send({
                        "status": "OK",
                        "message": "Successfully Deleted!"
                    });
            }
        },

        getTechnologies: function (req, res) {
            var search = req.query.search;
            techonologies.find({ 'name': new RegExp(search, 'i') }).select('name').exec(function (err, docs) {
                res.send(docs);
            });
        },

        searchCaseStudyByTechnologies: function (req, res) {

            var searchArray = req.body.search;          

            csModel.find({ 'technologies_used': { $elemMatch: { name: { $in: searchArray } } } }, function (err, docs) {
                if (err) {
                    return done(err);                    
                }
                if (docs) {
                    res.send(docs);                    
                }
            });

        },

        searchCaseStudy: function (req, res) {
            var search = req.query.search;
            var field = req.query.field;
            if (field == 'title') {
                csModel.find({ 'title': new RegExp(search, 'i') }).exec(function (err, docs) {
                    res.send(docs);
                });
            }
            if (field == 'master') {
                csModel.find({
                    '$or': [
                        { 'title': new RegExp(search, 'i') },
                        { 'created_by': new RegExp(search, 'i') },
                        { 'created_on': new RegExp(search, 'i') },
                        { 'description': new RegExp(search, 'i') },
                        { 'technologies_used': new RegExp(search, 'i') }
                    ]
                })
                    .exec(function (err, docs) {
                        res.send(docs);
                    });
            }

            if (field == 'technologies') {
                csModel.find({ 'technologies_used': new RegExp(search, 'i') }).exec(function (err, docs) {
                    res.send(docs);
                });
            }

        }



    }

}

