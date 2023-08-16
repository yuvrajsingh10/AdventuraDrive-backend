const mongoose  = require('mongoose')

const vehicleSchama = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    category:{
        type:String,
        required:true,
    },
    seatingCapacity:{
        type:Number,
        required:true
    },
    gate:{
        type:Number,
        required:true,
    },
    luggageCapacity:{
        type:Number
    },
    quantity:{
        type:Number,
        required:true,
    }
},{timestamps:true})


module.exports = mongoose.model("Vehicles",vehicleSchama);