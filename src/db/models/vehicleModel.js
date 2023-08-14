const mongoose  = require('mongoose')

const vehicleSchama = mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    vehicleType:{
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
    }
},{timeStamps:true})


module.exports = mongoose.model("Vehicles",vehicleSchama);