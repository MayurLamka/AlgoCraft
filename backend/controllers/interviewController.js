const Interview = require("../models/Interview");


/* =========================================
   GET ALL INTERVIEWS
========================================= */

const getAllInterviews = (req, res) => {

    Interview.getAllInterviews(
        (err, results) => {

            if (err) {

                console.error(
                    "Failed to fetch interviews:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch interviews"
                });
            }


            res.status(200).json({
                success: true,
                interviews: results
            });

        }
    );

};


module.exports = {
    getAllInterviews
};