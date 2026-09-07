const Dashboard = require("../models/Dashboard");


const getDashboard = (req, res) => {

    const userId = req.user.user_id;


    Dashboard.getTotalSolved(
        userId,
        (err, totalResult) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Failed to get total solved questions"
                });
            }


            Dashboard.getSolvedByDifficulty(
                userId,
                (err, difficultyResult) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Failed to get solved statistics"
                        });
                    }


                    Dashboard.getSavedCount(
                        userId,
                        (err, savedResult) => {

                            if (err) {
                                console.error(err);

                                return res.status(500).json({
                                    success: false,
                                    message: "Failed to get saved question count"
                                });
                            }


                            Dashboard.getRecentSubmissions(
                                userId,
                                (err, submissionsResult) => {

                                    if (err) {
                                        console.error(err);

                                        return res.status(500).json({
                                            success: false,
                                            message: "Failed to get recent submissions"
                                        });
                                    }


                                    let easySolved = 0;
                                    let mediumSolved = 0;
                                    let hardSolved = 0;


                                    difficultyResult.forEach(row => {

                                        if (row.difficulty === "Easy") {
                                            easySolved = row.count;
                                        }

                                        if (row.difficulty === "Medium") {
                                            mediumSolved = row.count;
                                        }

                                        if (row.difficulty === "Hard") {
                                            hardSolved = row.count;
                                        }

                                    });


                                    res.status(200).json({

                                        success: true,

                                        dashboard: {

                                            totalSolved:
                                                totalResult[0].totalSolved,

                                            easySolved,

                                            mediumSolved,

                                            hardSolved,

                                            savedQuestions:
                                                savedResult[0].savedQuestions,

                                            recentSubmissions:
                                                submissionsResult

                                        }

                                    });

                                }
                            );

                        }
                    );

                }
            );

        }
    );
};


module.exports = {
    getDashboard
};