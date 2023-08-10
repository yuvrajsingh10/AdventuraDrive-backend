const mongoose = require('mongoose');

const UserSchema = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
    },
    phone:{
        type:Number,
        required:true,
        min:10,
        max:10,
    },
    password:{
        type:String,
        required:true,
    },
    bookings:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Bookings",
    }
})

module.exports = mongoose.model('USERS',UserSchema);