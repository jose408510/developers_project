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
    }, 
    avatar:{
        type: String
    },
    likes: [{
        user: {
            type: Schema.Types.ObjectId,
        ref: 'users' // dont know if this should be User ... need to check before completion
        }
    }],
    comments:[
        {
        user:{ 
        type: Schema.Types.ObjectId,
        ref: 'users' // dont know if this should be User ... need to check before completion
        },
    text:{
        type: String,
        required: true
    },
    name:{
        type: String
    },
    avatar:{
        type: String
    },
    date: {
        type: Date,
        default: Date.now
    }
  }
]
});

module.exports = Post = mongoose.model('post', PostSchema)