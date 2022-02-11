function ch(data,status){
$.ajax({
    url:'/changestatus',
    data:{
        id:data,
        detail:status
    },
    method:'post',
    success:(d)=>{
        location.reload()
    }
})
}
function remove(data){
   $.ajax({
       url:'/removeurl',
       data:{
           id:data
       },
       method:'post',
       success:(d)=>{
           console.log(d)
           location.reload()
       }

   }) 
}