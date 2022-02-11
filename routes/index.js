var express = require('express');
const formdata=require('express-form-data')
const wordcounter=require('../functions/wordcount')
var app=express()
var router = express.Router();
app.use(formdata.parse())
let multer = require('multer');
let upload = multer();

//to get the wordcount and backlinks from url
router.post('/urlsearch/', upload.fields([]), (req, res) => {

  wordcounter.counter(req.body.url).then((data)=>{
    res.render('list',{data} )
  })
  

 });
 //fetching every search details
 router.get('/wholedata',(req,res)=>{
   wordcounter.wholedata().then((d)=>{
    
    res.render('wholelist',{d})
   })
 })

 /* GET home page. */
 router.get('/', function(req, res, next) {
   res.render('index', { title: 'Webscrawler' });
 });
 
 //add to favourite and remove from favourite router
 router.post('/changestatus', upload.fields([]),(req,res)=>{
  //console.log('apicall')
  //check for current status
  if(req.body.detail==='false'){
  wordcounter.changestatustotrue(req.body.id,req.body.detail).then((d)=>{
    res.json(d)
  })
  }else{
   wordcounter.changestatustofalse(req.body.id,req.body.detail).then((d)=>{
    res.json(d)
   })

  }
})
//Delete a particular list
router.post('/removeurl',upload.fields([]),(req,res)=>{
  console.log('apicall')
  wordcounter.removeurl(req.body.id).then((d)=>{
   res.json(d)   
  })

})
// router.post('/urlsearch',function(req,res){
//   console.log(req)
// // })

//  router.get('/lists',function(req,res){
//    res.render('list',{answer:'lists'})

//  })
module.exports = router;
