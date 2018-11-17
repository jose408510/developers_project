const mongoose = require('mongoose')
const Schema = mongoose.Schema;

//create Schema 

const PostSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users' // dont know if this should be User ... need to check before completion
    },
    text:{
        type: String,
        required: true 
    },
    name: {
        type: String
    }
})