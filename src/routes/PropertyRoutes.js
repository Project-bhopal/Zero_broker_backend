const propertyController = require("../controllers/PropertyController");
const express = require("express");
const router = express.Router();
const upload = require("../middleware/uploadFile"); 


router.post("/create",upload, propertyController.createProperty);

router.patch("/update/:id", upload, propertyController.updateProperty);

router.post("/approve/:id", propertyController.approveProperty);

router.get("/getProperties", propertyController.getAllProperties); 

router.delete("/delete", propertyController.deleteProperty); 

module.exports = router;