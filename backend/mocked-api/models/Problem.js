const { Schema, model } = require("mongoose");

const ProblemSchema = new Schema(
  {
    title: {
      type: "String",
      required: true,
      unique: true
    },
    tags: [String],
    level: {
      type: Number,
      min: 1,
      max: 10,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    author: String,
    info: String, // for misc informtion about the problem
    photo: String,
    time_limit: Number,
    memory_limit: Number,
    samples: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true }
      }
    ],
    test_cases: [
      {
        input: { type: String, required: true },
        output: { type: String, required: true }
      }
    ]
  },
  {
    timestamps: true,
    collection: "Problems"
  }
);

const Problem = model("Problem", ProblemSchema);
module.exports = Problem;
