const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require('cors');
const path=require("path")
dotenv.config();
const connectdb = require("./src/config/db");
const cookieParser = require("cookie-parser");
const userRoutes = require("./src/routes/UserRoutes");
const agentRoutes = require("./src/routes/agentRoutes");
const profileRoutes = require("./src/routes/profileRoutes");
const requestedPropertyRoutes = require('./src/routes/requestedPropertyRoutes');
const BannerRoutes=require("./src/routes/bannerRoutes")
const OfferRoutes=require("./src/routes/offerRoutes")
const propertyRoutes=require("./src/routes/PropertyRoutes")
const propertiesFilter=require("./src/routes/propertFiletrRoutes")
const { errorHandler } = require("./src/middleware/errorHandler");
const planRoutes = require("./src/routes/planRoutes");
const subscriptionRoutes = require("./src/routes/subscriptionRoutes");
const paymentRoutes = require("./src/routes/paymentRoutes");
const webhookRoutes = require("./src/routes/stripeWebhook");


// app.set("trust proxy", 1); // 👈 Fix for AWS/Nginx


app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'src','uploads')));
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
// app.use("/api/v1/chatbot",chatBotRoutes)
app.use("/api/banners",BannerRoutes)
app.use("/api/offers",OfferRoutes)
// app.use("/api/ads",adsRouters)
app.use("/api/v1", planRoutes);
app.use("/api/subscription", subscriptionRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/webhooks", webhookRoutes);



// Global Error Handler (Must be at the bottom)
app.use(errorHandler);
const port = process.env.PORT || 5000;
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
