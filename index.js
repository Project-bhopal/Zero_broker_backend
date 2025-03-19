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

const propertyRoutes=require("./src/routes/PropertyRoutes")
const propertiesFilter=require("./src/routes/propertFiletrRoutes")


// app.set("trust proxy", 1); // 👈 Fix for AWS/Nginx


app.use(express.json());
app.use("/uploads", express.static("uploads")); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

const corsOptions = {
    origin: "http://localhost:3000", // 👈 for all user Use frontend domain
    // origin: "http://13.201.213.81:3000", // 👈 Use frontend domain
    credentials: true, // 👈 Allow cookies
    methods: ["GET", "POST", "PATCH", "DELETE"],
};
app.use(cors(corsOptions));

connectdb();

app.get("/api", (req, res) => {
    res.send("Hello World!");
});

app.use('/api/v1/auth', userRoutes);
app.use("/api/v1/agents", agentRoutes);
app.use("/api/v1/profile", profileRoutes);

app.use('/api/v1/property', propertyRoutes);
app.use("/api/v1/requestproperty",requestedPropertyRoutes)
app.use('/api/v1',propertiesFilter)


const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
