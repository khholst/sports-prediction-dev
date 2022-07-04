const jwt = require("jsonwebtoken");


module.exports = (req, res, next) => {
    try {
        const token = req.get("token");
        const decoded = jwt.verify(token, process.env.JWTSECRET);
        next();
    } catch (error) {
        if (error.name === "TokenExpiredError") {
            res.status(200).json({
                code: 401,
                errors: [
                    {
                        msg: "Session expired"
                    }
                ]
            })
        } else {
            res.status(200).json({
                code: 401,
                errors: [
                    {
                        msg: "Invalid request"
                    }
                ]
            })
        }
    }
}