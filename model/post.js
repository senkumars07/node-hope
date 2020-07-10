const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const mongodbErrorHandler = require("mongoose-mongodb-errors");

const postSchema = new Schema(
  {
    id: {
      type: Number,
      unique: true,
      required: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    body: {
      type: String,
      trim: true,
      required: true,
    },
    comments: [{
        name: String,
        email: String,
        body: String
    }],
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

postSchema.plugin(mongodbErrorHandler);

postSchema.index({
  id: 1,
});

module.exports = mongoose.model("Post", postSchema);
