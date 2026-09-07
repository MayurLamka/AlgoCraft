const express = require("express");

const router = express.Router();

const {
    getAllTopics
} = require("../controllers/topicController");


// GET all topics
router.get("/", getAllTopics);


module.exports = router;