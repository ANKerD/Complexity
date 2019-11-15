const { Schema, model } = require("mongoose");

const SubmissionSchema = new Schema(
  {
    problem_id: String,
    state: String,
    result: String
  },
  {
    timestamps: true,
    collection: "Submissions"
  }
);

const Submission = model("Submission", SubmissionSchema);
module.exports = Submission;
