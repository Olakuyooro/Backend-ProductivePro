const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TaskSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true
  },
  type: {
    type: String,
    required: true,
  },
  creator:{
    type: Schema.Types.ObjectId,
    ref: 'User',
    required:true
  }
}, {timestamps: true});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task