const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    nickname: {
        type: String,
        require: true,
        unique: true,
    },
    email: {
        type: String,
        require: true,
        unique: true,
    },
    password: String,
    
    userImage:{
        type: String,
        required: true
    }  
});


UserSchema.virtual('userId').get(function () {
    return this._id.toHexString();
});
UserSchema.set('toJSON', {
    virtuals: true,
});
//_id 값을 바로 가지게 함.

module.exports = mongoose.model('User', UserSchema);

