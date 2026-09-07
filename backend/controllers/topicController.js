const Topic = require("../models/topicModel");


// Get all topics
const getAllTopics = (req, res) => {

    Topic.getAllTopics((err, topics) => {

        if (err) {

            console.error("Error fetching topics:", err);

            return res.status(500).json({
                success: false,
                message: "Failed to fetch topics"
            });
        }


        return res.status(200).json({
            success: true,
            topics: topics
        });

    });
};


module.exports = {
    getAllTopics
};