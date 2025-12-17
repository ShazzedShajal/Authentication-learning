const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

// user schema
const userSchema = new mongoose.Schema({
    name: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    createdOn: {
        type: Date,
        default: Date.now
    }

});

// Hash password before saving
userSchema.pre("save", async function () {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified("password")) {
        return;
    }

    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords for login
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

// collection name is User
module.exports = mongoose.model("User", userSchema);