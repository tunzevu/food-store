const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'must have user name']
    },
    email: {
        type: String,
        required: [true, 'must have user email']
    },
    password: {
        type: String,
        required: [true, 'must have user password'],
        select: false,
        minlength: 8,
        maxlength: 32
    },
    passwordConfirm: {
        type: String,
        validate: {
            validator: function(el) {
                return el === this.password;
            }
        }
    },
    changedPasswordAt: Date,
    role: {
        type: String,
        default: 'user',
        // enum: ['user', 'admin']
    }
});

//crypt password
userSchema.pre('save', async function(next) {
    this.password = await bcrypt.hash(this.password, 12);
    this.passwordConfirm = undefined;
    this.changedPasswordAt = new Date(Date.now() - 10*1000);

    next();
});

//compare password
userSchema.methods.checkPassword = async(textPassword, hashPassword) => {
    const result = await bcrypt.compare(textPassword, hashPassword);
    return result;
};

const User = mongoose.model('User', userSchema);
module.exports = User;