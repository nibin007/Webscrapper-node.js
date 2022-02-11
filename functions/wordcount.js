const request=require('request')
const cheerio=require('cheerio')
const promise=require('promise')
var db= require('../connection/connection')
const { resolve, reject } = require('promise')
// const { html } = require('cheerio/lib/api/manipulation')
// const { json } = require('body-parser')
 const { ObjectId } = require('mongodb')
// const { ObjectID } = require('bson')
module.exports={
    

    counter:(url)=>{
     return new promise ((resolve,reject)=>{
          request(url,(error, response,html)=>{
            //successfulurlfetch
            if(!error && response.statusCode==200){
                
                obj={url:url,
                    wordcount:null,
                     links:null,
                     media:null,
                     favourite:false}
                const $ =cheerio.load(html)
                //contains the text of html
                const text=$.text()
                //iframe tags couldnt removed so had to do a regex
                const str =text.replace(/<iframe[^>]*>[\s\S]*?<\/iframe[^>]*>/ig,"");
              
               //removes extraspaces
               const ans=str.replace(/\s\s+/g, ' ')
                 // returns totalcount
               const count=( ans.split(' ').length)
                 console.log(count)
                obj.wordcount=count
               
                //fetch backlinks
                backlinks($).then((data)=>{
                    
                   obj.links=data
               Media($).then((imgarray)=>{
                   obj.media=imgarray
                
              //passing the object to db     
              savetodb(obj).then((ans)=>{
               resolve(ans)
                    
                })   
    
               })
                  
              })
              
                    
            }else{
                console.log('errror')
            }
        }
         
        )


     }
     
     ) 
          
         },

    wholedata:()=>{
       return new promise(async(resolve,reject)=>{
         let data=await db.get().collection('url').find().toArray()
         resolve(data)
       }) 
    },
    changestatustotrue:(id,details)=>{
        return new promise((resolve,reject)=>{
            db.get().collection('url').updateOne({_id:ObjectId(id)}, 
           {$set:{
               favourite:true

           }
        }
            
            ).then((response)=>{
                resolve(response)
            })
        })
    },
    changestatustofalse:(id)=>{
    return new promise((resolve,reject)=>{
        db.get().collection('url').updateOne({_id:ObjectId(id)},
        { $set:{
            favourite:false
        }

        }
        
        ).then((response)=>{
            console.log(response)
            resolve(response)
        })
    })
    },
    removeurl:(id)=>{
        return new promise((resolve,reject)=>{
            db.get().collection('url').deleteOne({_id:ObjectId(id)}).then((response)=>{
             resolve(response)
            })
        })

    }
  
}
           
    
    
function backlinks($){
    return new promise((resolve,reject)=>{
        const linkobjects=$('a')
        const links=[]
        linkobjects.each(async (index,element)=>{
          // var t=await $(element).attr('href').lastIndexOf('http',0)
          // console.log(t)
            if($(element).attr('href')==null){
                return 
            }
            else{
                links.push(
                      $(element).attr('href')
                 )  }
            
        
                

        })
      
        resolve(links)
        
    })
}
function Media($){
    return new promise((resolve,reject)=>{
        const imageobject=$('img')
        const imgarray=[]
        imageobject.each(async (i,element)=>{
            //checking if element is empty,if so retuurn will act as continue and move to next iteration
            //var  truth=  $(element).attr('src').lastIndexOf('http',0)
             if($(element).attr('src')==null){
                
                return  
                }
            
            else{
               imgarray.push(
            $(element).attr('src')
                 )     } 
      
        })
        resolve(imgarray)
    })
}
function savetodb(data){
    return new promise((resolve,reject)=>{
        db.get().collection('url').insertOne(data).then((result)=>{
         
            resolve(data)
        })

    })
}