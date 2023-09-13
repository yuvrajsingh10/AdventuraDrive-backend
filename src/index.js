const express = require("express");
const app = express();
const dotenv = require("dotenv")
dotenv.config();
const initDbConnection = require("./db/init.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes");
const bookingRoutes = require('./routes/bookingRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');
const port = process.env.PORT || 3000 ;
const morgan = require('morgan')
const corsOptions={
  origin:'http://localhost:5173',
  credentials:true,
  optionSuccessStatus:200,  
}

app.use(morgan('dev'))
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authRoutes);
app.use('/api/bookings',bookingRoutes)
app.use('/api/vehicle',vehicleRoutes)

initDbConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`App is running on ${port}`);
    });
  })
  .catch((error) => {
    console.log("404 Error in db connection",error);
  });
