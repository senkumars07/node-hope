const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongodbErrorHandler = require("mongoose-mongodb-errors");

const userSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      trim: true,
      required: true,
    },
    password: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    role: { type: String, default: 'user' },
    profilePic: {type: String},
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: false,
  }
);

userSchema.plugin(mongodbErrorHandler);

userSchema.index({
  id: 1,
});

module.exports = mongoose.model("User", userSchema);
