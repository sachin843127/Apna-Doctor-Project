const mongoose = require("mongoose");

const recordSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    name: String,
    symptomText: String,
    disease: String
  },
  { timestamps: true }
);

module.exports = mongoose.model("Record", recordSchema);
