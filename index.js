const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require('cors');
dotenv.config();
const connectdb = require("./src/config/db");
const cookieParser = require("cookie-parser");
const userRoutes = require("./src/routes/UserRoutes");
const agentRoutes = require("./src/routes/agentRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const requestedPropertyRoutes = require('./src/routes/requestedPropertyRoutes');

app.use(express.json());
app.use("/uploads", express.static("uploads")); // Serve static files
app.use(express.urlencoded({ extended: true })); 

app.use(cookieParser());
// app.use(cors({ credentials: true, origin: true })); // Allow frontend to send cookies
const corsOptions = {
    origin: "*", 
    credentials: true, // Allow cookies
    // methods: ["GET", "POST", "PATCH", "DELETE"], // Restrict allowed methods
  };
  
app.use(cors(corsOptions));
  
connectdb();

app.get("/", (req, res) => {
    res.send("Hello World!");
});
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ status: "error", message: "Internal Server Error" });
});
  

app.use('/api/v1/auth' ,userRoutes);
app.use("/api/v1/agents", agentRoutes);
app.use("/api/v1/profile", profileRoutes);
app.use('/api/v1/property', requestedPropertyRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});