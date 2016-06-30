var _ = require ('lodash');
var user =  require('./userModel.js')

module.exports=function(app){    

    
app.get('/getUsers',function(req,res){    
    user.find(function (err,users) 
    {
      if(err)          
        res.json({info:'Cant find users',error:err});      
      else
         res.json({info:'Users found Successfully'  ,data:users,}); 
        
    });   
  
});  


app.get('/getUser/:id',function(req,res){
    
    res.send(
        _.find  (
           userDetails,{id:req.params.id}            
        ) 
    );
    
});
    
};



