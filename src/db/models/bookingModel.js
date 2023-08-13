const mongoose =require('mongoose');

const bookingSchema=mongoose.Schema({
    vehicleType:{
        type:String,
        required:true
    },
    pickUpLocation:{
        type:String,
        required:true,
    },
    dropLocation:{
        type:String,
        required:true,
    },
    pickUpDate:{
        type:Date,
        required:true
    },
    returnDate:{
        type:Date,
        required:true
    },
    pickUpTime:{
        type:String,
        required:true,
    },
    returnTime:{
        type:String,
        required:true,
    },
    bookedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Users"
    }
})

module.exports = mongoose.model('Bookings',bookingSchema);