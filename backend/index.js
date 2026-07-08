import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import voterRoutes from "./routes/voterRoutes.js";
import Login from "./controllers/loginController.js";
import Feedback from "./routes/feedbackRoutes.js";
import Logout from "./routes/logoutRoutes.js";
import cors from "cors";
import voteRoutes from "./routes/vote.js";
import  forgetPassword from "./routes/forgetpassword.js";
import verifyOtpRouter from './routes/verifyotp.js';
import resetpassword from './routes/resetpassword.js';
import resendOtpRouter from "./routes/resendotp.js";
import resultsRoute from "./routes/results.js";


dotenv.config();
connectDB();
console.log("JWT_SECRET 👉", process.env.JWT_SECRET);

const app = express();
app.use(express.json()); 
app.use(cors()); 
app.use(express.urlencoded({ extended: true }));
app.get("/", (req, res) => {
  res.send(`
    <script>
      alert("Welcome Home!");
    </script>
  `);
});

app.use("/api/voters", voterRoutes);
app.use("/api/voters", Login);
app.use("/api/feedback", Feedback);
app.use("/api/voters", Logout);
app.use("/api/vote", voteRoutes);
app.use('/api', forgetPassword);
app.use('/api', verifyOtpRouter);
app.use('/api/resetpassword', resetpassword);
app.use("/api", resendOtpRouter);
app.use("/api", resultsRoute);
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
