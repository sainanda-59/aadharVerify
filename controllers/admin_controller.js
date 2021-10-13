module.exports.signIn = function(req,res){
   res.render('adminSignIn');
}

 module.exports.Login = function(req,res){
   if(req.body.username=='admin' && req.body.password=='admin123'){
     res.redirect('/dashboard');
   }
   else{
      res.render('adminSignIn');
   }
}