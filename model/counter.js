const mongoose = require('mongoose')
const Schema = mongoose.Schema

const counterSchema = new Schema({
    identifierName:{
        type: String
    },
    count:{
        type: Number
    }
}, {
    timestamps: true
})

const Counter = mongoose.model('Counter', counterSchema)
module.exports = Counter