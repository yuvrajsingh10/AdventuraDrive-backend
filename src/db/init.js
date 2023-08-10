const mongoose = require('mongoose');
const uri="mongodb+srv://Root:Root@todo.yyg8mov.mongodb.net/?retryWrites=true&w=majority"
const initDbConnection=()=>{
    return mongoose.connect(uri);
}

module.exports = initDbConnection