import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
  {
    id:          String,
    severity:    { type: String, enum: ["critical", "warning", "info", "suggestion"] },
    title:       String,
    description: String,
    line:        Number,
    fix:         String,
  },
  { _id: false }
);

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref:  "User",
      required: true,
    },
    code:     { type: String, required: true },
    mode:     { type: String, required: true },
    language: { type: String, default: "" },
    result: {
      language:      String,
      summary:       String,
      score:         Number,
      issues:        [issueSchema],
      metrics: {
        complexity:      String,
        maintainability: String,
        testability:     String,
        performance:     String,
      },
      rewritten:     String,
      rewrite_notes: [String],
    },
    duration: Number,
  },
  { timestamps: true }
);

export const Review = mongoose.model("Review", reviewSchema);
