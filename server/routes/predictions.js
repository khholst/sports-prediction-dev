const authenticate = require("../middleware/authenticate");
const predictionController = require("../controllers/predictionController");
const router = require("express").Router();

router.get("/", predictionController.all);






module.exports = router;