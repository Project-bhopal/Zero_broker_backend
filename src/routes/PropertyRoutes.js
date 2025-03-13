const propertyController = require("../controllers/PropertyController");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadFile"); 
const {authorizeRoles,accessTokenVerify}=require("../middleware/authMiddleware")


router.post("/create",accessTokenVerify, authorizeRoles("admin"), propertyController.createProperty);

router.patch("/update/:id", upload, propertyController.updateProperty);

router.post("/approve/:id", propertyController.approveProperty);

router.get("/getProperties", propertyController.getAllProperties); 

router.delete("/delete", propertyController.deleteProperty); 

module.exports = router;