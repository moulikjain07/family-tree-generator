let mongoose = require('mongoose')

let userSchema = new mongoose.Schema({
    name: String,
    age : Number,
    gender: String,
    partner: String,
    siblings: { type : Array , "default" : [] },
    parents: { type : Array , "default" : [] },
    childs: { type : Array , "default" : [] } 
})


module.exports = mongoose.model('User', userSchema)

