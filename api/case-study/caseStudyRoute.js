module.exports = function (app) {
  
    var csController = require('./caseStudyController').controller(app);    

    app.get('/index', csController.index);

    app.get('/caseStudies', csController.getCaseStudies);

    app.get('/caseStudy', csController.getCaseStudy);
    
    app.get('/technologies', csController.getTechnologies);

    app.post('/caseStudy', csController.addCaseStudy);
    
    app.put('/editCaseStudy', csController.editCaseStudy);
    
    app.put('/deleteCaseStudy', csController.deleteCaseStudy);
    
    app.post('/upload', csController.uploadFiles);
    
    app.get('/getFiles',csController.readFiles);

    app.get('/searchCaseStudy',csController.searchCaseStudy);

    app.post('/searchCaseStudyByTechnologies',csController.searchCaseStudyByTechnologies);

}
