const mongoclient=require('mongodb').MongoClient
const state={db:null}
module.exports.connect=function(done){
    const dbname='wordcounter'
    const url= 'mongodb+srv://nibin:arsenewenger12@cluster0.5w7yg.mongodb.net/wordcounter'
    mongoclient.connect(url,(err,data)=>{
        if(err) return done(err)
        state.db=data.db(dbname)
        done() 
    })

}
module.exports.get=function(){
    return state.db
}