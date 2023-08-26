const mongoose = require('mongoose');
const { Schema } = mongoose
const UserSchema = new Schema({
    name:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
   password:{
        type: String,
        required: true
    },
    date:{
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('user', UserSchema);
// yeh function first argument as model ka name leta hai aur second argument as Schema leta hai 