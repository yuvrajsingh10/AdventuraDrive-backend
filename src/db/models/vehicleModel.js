const mongoose = require("mongoose");

const vehicleSchama = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      default:"Car",
      enum:["Car","Van","Minibus","Prestige"]
    },
    Type:{
      type:String,
      default:"Sedan",
      enum:['Suv','Sedan',"HatchBack"]
    },
    seatingCapacity: {
      type: Number,
      required: true,
    },
    gate: {
      type: Number,
      required: true,
    },
    luggageCapacity: {
      type: Number,
    },
    images:[],
    price:{
      type:Number,
      required:true,
    },     
    bookingTimeStamps: [],
    status: {
      type: String,
      default: "available",
      enum: ["available", "booked"],
    },
    quantity: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Vehicles", vehicleSchama);
