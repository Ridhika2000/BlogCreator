const mongoose=require('mongoose');

uri=process.env.DATABASE_URI

mongoose.connect(uri, {useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology: true, useFindAndModify:false})
    .catch((err)=>{
        console.log('Error in connection');
    })

const connection = mongoose.connection

connection.on('connected', ()=>{
    console.log('MongoDb Connected!');
})

