const express = require("express");
const app = express();
const dotenv = require("dotenv")
dotenv.config();
const initDbConnection = require("./db/init.js");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const authRoutes = require("./routes/authRoutes.js");
const port = process.env.PORT || 3000 ;

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api/user", authRoutes);

initDbConnection()
  .then(() => {
    app.listen(3000, () => {
      console.log(`App is running on ${port}`);
    });
  })
  .catch((error) => {
    console.log("404 Error in db connection",error);
  });
