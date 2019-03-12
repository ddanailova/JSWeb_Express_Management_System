const mongoose = require('mongoose');
const Schema = mongoose.Schema
const encryption = require('./../utilities/encryption');

let userSchema = mongoose.Schema({
    username: {
        type: Schema.Types.String,
        required: true,
        unique: true
    },
    passwordHash: {
        type: Schema.Types.String,
        required: true
    },
    firstName: {
        type: Schema.Types.String,
        required: true
    },
    lastName: {
        type: Schema.Types.String,
        required: true
    },
    teams:[{
        type:Schema.Types.ObjectId,
        ref:'Team',
        default:[]
    }],
    profilePic:{
        type:Schema.Types.String,
        default:"/images/user-male-icon.png"
    },
    roles: [{
        type: Schema.Types.String
    }],
    salt: {
        type: Schema.Types.String,
        required: true
    },
}, {
    usePushEach: true
});


userSchema.method({
    authenticate: function (password) {
        let inputPasswordHash = encryption.hashPassword(password, this.salt);
        let isSamePasswordHash = inputPasswordHash === this.passwordHash;
        return isSamePasswordHash;
    },

    // isAuthor: function (article) {
    //     if (!article) {
    //         return false;
    //     }

    //     let isAuthor = article.author.equals(this.id);

    //     return isAuthor;
    // },

    isInRole: function (role) {
        return this.roles.indexOf(role) !== -1;
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;

User.seedAdmin = async () => {
    try {
        let users = await User.find();
        if (users.length > 0) return;
        const salt = encryption.generateSalt();
        const passwordHash = encryption.hashPassword('admin', salt);
        return User.create({
            username: 'admin',
            passwordHash,
            salt,
            firstName: "Admin",
            lastName:"Adminov",
            roles: ['Admin']
        });
    } catch (e) {
        console.log(e);
    }
};