const { Schema, model } = require("mongoose");
const Problem = require("../models/Problem");
const ObjectId = Schema.Types.ObjectId;

const SubmissionSchema = new Schema(
  {
    problem_id: {
        type: ObjectId,
        ref: "Problem"
    },
    state: {
        type: String,
        enum: ["SUBMITTED","FINISHED"]
    },
    result: {
        type: String,
        enum: ["AC", "WA", "TLE", "MLE", "RE"]
    },
    language: {
        type: String,
        enum: ["python", "cplusplus"]
    }
  },
  {
    timestamps: true,
    collection: "Submissions"
  }
);

SubmissionSchema.methods.show = async function() {
    problem = await Problem.findOne({_id:this.problem_id});

    return {
        sid: this._id,
        pid: this.problem_id,
        name: problem.title,
        state: this.state,
        result: this.result,
        language: this.language,
        date: this.createdAt
    }
}

const Submission = model("Submission", SubmissionSchema);
module.exports = Submission;
