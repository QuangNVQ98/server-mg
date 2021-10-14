const mongoose = require("mongoose");

const schema = new mongoose.Schema(
  {
    acc_clone_id: {
      type: mongoose.Types.ObjectId,
      index: true,
    },
    startTime: Number,
    endTime: Number,
    count: Number,
    totalTime: Number,
    isRunning: {
      type: Boolean,
      default: false
    }
  },
  {
    autoIndex: false,
  }
);

module.exports = mongoose.model("statistics", schema);
