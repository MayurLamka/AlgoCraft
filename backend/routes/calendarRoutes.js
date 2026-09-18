const express = require("express");

const router = express.Router();

const {
    getCalendar
} = require("../controllers/calendarController");

const authMiddleware =
    require("../middleware/authMiddleware");


router.get(
    "/",
    authMiddleware,
    getCalendar
);


module.exports = router;