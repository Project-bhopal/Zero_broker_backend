const propertyController = require("../controllers/PropertyController");
const express = require("express");
const router = express.Router();
const {upload} = require("../utils/multer"); 
const {authorizeRoles,accessTokenVerify}=require("../middleware/authMiddleware")

const uploadfiles = upload.fields([{ name: "images", maxCount: 5 }, { name: "videos", maxCount: 2 }])


router.post("/create",accessTokenVerify, 
  authorizeRoles("agent"), 
  uploadfiles,
  propertyController.createProperty);

router.patch("/update/:id",accessTokenVerify,
    authorizeRoles("admin"),
     uploadfiles,
      propertyController.updateProperty);



router.post("/approve/:id",accessTokenVerify, authorizeRoles("admin"),propertyController.approveProperty);

router.get("/getProperties",accessTokenVerify, authorizeRoles("admin"), propertyController.getAllProperties); 

router.get("/getPropertiesByAgent/:id",accessTokenVerify, authorizeRoles("agent"),propertyController.getPropertiesByAgent)

router.delete("/:id",accessTokenVerify, authorizeRoles("agent"), propertyController.deleteProperty); 

module.exports = router;