const mongoose = require('mongoose');
let uri=process.env.MONGODB_URI
const initDbConnection=()=>{
    return mongoose.connect(uri);
}

module.exports = initDbConnection