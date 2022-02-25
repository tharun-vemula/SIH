const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = Schema({
    name:{
        type : String,
        required : true
    },

    email :{
        type: String,
        required : true,
    },

    password : {
        type: String,
        required : true,
    },

    contribution: {
        posts: [
          {
            postId: {
              type: Schema.Types.ObjectId,
              ref: 'Post',
              required: true
            }
            
          }
        ]
      },

    photoUrl : String
});

module.exports = mongoose.model('User',userSchema); 