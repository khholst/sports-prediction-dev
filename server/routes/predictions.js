const authenticate = require("../middleware/authenticate");
const predictionController = require("../controllers/predictionController");
const router = require("express").Router();

router.get("/", authenticate, predictionController.all);






module.exports = router;