const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const userSchema = mongoose.Schema;


const user = new userSchema({
    email: {
        type: String,
        required: true
    }
});

user.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', user);