var async = require('async');
var Company = require('../models/company');

module.exports = (app) => {
    var test=0;
    
    app.get('/review/:id', (req, res) => {
        var messg = req.flash('success');
        Company.findOne({'_id':req.params.id}, (err, data) => {
            res.render('company/review', {title: 'Company Review', user:req.user, data:data, msg: messg, hasMsg: messg.length>0});
        });
    });
    
    app.post('/review/:id', (req, res) => {
        console.log("yaa its enter");
      
    Company.find({'_id' : req.params.id} , function(err , company){
      if(err)
      {
        console.log(err);
      }
      else{
         console.log(company); 
          console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%");
          console.log(req.user.fullname);

          for(var i = 0; i< company[0].companyRating.length ; i++)
          {

          if(company[0].companyRating[i].userFullname === req.user.fullname )
          {
            console.log("you can not add review");
            test = 2;
          }

          }


          if(test!=2)
          {
            test = 0;
             console.log("added review");

           async.waterfall([
            function(callback){
                Company.findOne({'_id':req.params.id}, (err, result) => {
                    callback(err, result);
                });
            },
            
            function(result, callback){
                Company.update({
                    '_id': req.params.id
                },
                {
                    $push: {companyRating: {
                        companyName: req.body.sender,
                        userFullname: req.user.fullname,
                        userRole: req.user.role,
                        companyImage: req.user.company.image,
                        userRating: req.body.clickedValue,
                        userReview: req.body.review
                    }, 
                        ratingNumber: req.body.clickedValue       
                    },
                    $inc: {ratingSum: req.body.clickedValue}
                }, (err) => {
                    req.flash('success', 'Your review has been added.');
                    res.redirect('/review/'+req.params.id)
                });
            }
        ]);

            }
            else{
                test = 0;

                console.log("rendering");

            req.flash('success', 'you can not give review again');
            res.redirect('/review/'+req.params.id);
            }

      }
    });
    });

}



// app.get("/review/:name/update/:id" , function(req,res){
//   if(req.params.name === req.user.fullname)
//   {
//     var messg = req.flash('success');
//         Company.findOne({'_id':req.params.id}, (err, data) => {
//             res.render('company/updatereview', {title: 'Company Review', user:req.user, data:data, msg: messg, hasMsg: messg.length>0});
//         });
//   }
// });


//  app.post('/update/review/:id', (req, res) => {
//         console.log("enter in update zone");
      
//     Company.find({id : req.params.id} , function(err , company){
//       if(err)
//       {
//         console.log(err);
//       }
//       else{
//              console.log("added review");
//             console.log(company);
//            async.waterfall([
//             function(callback){
//                 Company.findOne({'_id' :req.params.id}, (err, result) => {
//                     if(err)
//                     {
//                         console.log(err);
//                     }
//                     console.log(result);
//                     callback(err, result);
//                 });
//             },
            
//             function(result, callback){
//                 Company.update({
//                     '_id': req.params.id
//                 },
//                 {
//                     $push: {companyRating: {
//                         companyName: req.body.sender,
//                         userFullname: req.user.fullname,
//                         userRole: req.user.role,
//                         companyImage: req.user.company.image,
//                         userRating: req.body.clickedValue,
//                         userReview: req.body.review
//                     }, 
//                         ratingNumber: req.body.clickedValue       
//                     },
//                     $inc: {ratingSum: req.body.clickedValue}
//                 }, (err) => {
//                     req.flash('success', 'Your review has been added.');
//                     res.redirect('/review/'+req.params.id)
//                 });
//             }
//         ]);


//       }
//     });
// });








































