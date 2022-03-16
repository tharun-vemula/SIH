const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const postSchema = Schema({
    title:{
        type : String,
        required : true
    },

    meta: {
        type: String,
        required: true
    },
    
    content :{
        type: String,
        required : true,
    },

    createrId : {
        type: Schema.Types.ObjectId,
        ref : 'User',
        required : true,
    },

    photoUrl : String,

    postPath : String,

    creator : {
        type : String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('Post',postSchema); 