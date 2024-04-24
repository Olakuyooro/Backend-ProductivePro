const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StickyWallSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    creator: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const StickyWall = mongoose.model("StickyWall", StickyWallSchema);

module.exports = StickyWall;
