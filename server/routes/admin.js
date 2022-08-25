const router = require("express").Router();
const authenticate = require("../middleware/authenticate");
const adminController = require("../controllers/adminController")


router.post("/tournaments/new", authenticate, adminController.newTournament);



module.exports = router;