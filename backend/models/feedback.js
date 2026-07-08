import mongoose from "mongoose";
import Counter from "./counter.js";

const feedbackSchema = new mongoose.Schema({
  feedback_id: { type: Number, unique: true },
  message: { type: String, required: true },
});

// Pre-save hook to auto-increment feedback_id
feedbackSchema.pre("save", async function (next) {
  if (this.isNew) {
    try {
      const counter = await Counter.findByIdAndUpdate(
        { _id: "feedback_id" },      
        { $inc: { seq: 1 } },        
        { new: true, upsert: true }   
      );
      this.feedback_id = counter.seq;
    } catch (err) {
      return next(err);
    }
  }
  next();
});

export default mongoose.models.Feedback || mongoose.model("Feedback", feedbackSchema);
