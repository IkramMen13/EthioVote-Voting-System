import mongoose from "mongoose";

const peopleSchema = new mongoose.Schema({
  people_id: Number,
  first_name: String,
  last_name: String,
  gender: String,
  email: { type: String, unique: true },
  phone_number: { type : String, unique : true },
  fin: { type: String, unique: true },
  date_of_birth: Date
});

export default mongoose.models.People || mongoose.model("People", peopleSchema);

