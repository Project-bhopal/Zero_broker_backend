const express = require("express");
const router = express.Router();
const {authorizeRoles,accessTokenVerify}=require("../middleware/authMiddleware")
const propertyController = require("../controllers/propertyFilterController");
const savedSearchController=require("../controllers/savedSearchController")

router.get("/properties",accessTokenVerify,propertyController.getfilterData)
router.post("/savedsearch",accessTokenVerify,authorizeRoles("buyer"),savedSearchController.saveSearch)
router.get("/searches",accessTokenVerify,authorizeRoles("buyer"),savedSearchController.getAllSavedSearches)
router.get('/:search_name',accessTokenVerify,authorizeRoles("buyer"),savedSearchController.getSearchProperties)

module.exports = router;

