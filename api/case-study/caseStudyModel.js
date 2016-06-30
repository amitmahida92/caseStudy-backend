var mongoose = require('mongoose');

var caseStudyModel = mongoose.Schema({
    id: String,
    title: String,
    technologies_used: Array,
    description: String,
    created_by: String,
    modified_by: String,
    start_date: String,
    end_date: String,
    status:{ type: Number, default: 1 },
    created_on: String,
    modified_on: String,
    mainScreen: Object,
    relatedFiles: Array
});

module.exports = mongoose.model('caseStudies', caseStudyModel);