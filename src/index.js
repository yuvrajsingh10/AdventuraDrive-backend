const express = require("express");
const app = express();
const initDbConnection = require("./db/init.js");
const cors = require('cors')
const port = 3000;  

app.use(cors())
app.use(express.json());
app.use(express.urlencoded({extended:true}));
// app.use()

initDbConnection().then(() => {
  app.listen(3000, () => {
    console.log(`App is running on ${port}`);
  });
}).catch((error)=>{
    console.log("404 Error in db connection")
})
