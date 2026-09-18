const DailyQuestion = require("../models/DailyQuestion");


/* =========================================
   GET CALENDAR
========================================= */

const getCalendar = async (req, res) => {

    try {

        const userId = req.user.user_id;

        const now = new Date();

        const year =
            parseInt(req.query.year) ||
            now.getFullYear();

        const month =
            parseInt(req.query.month) ||
            (now.getMonth() + 1);


        /* =====================================
           VALIDATE MONTH
        ===================================== */

        if (month < 1 || month > 12) {

            return res.status(400).json({

                success: false,

                message: "Invalid month"

            });

        }


        /* =====================================
           GENERATE MISSING DATES
        ===================================== */

        await DailyQuestion.generateMissingDates(
            year,
            month
        );


        /* =====================================
           GET CALENDAR
        ===================================== */

        const calendar =
            await DailyQuestion.getCalendarQuestions(
                year,
                month,
                userId
            );


        /* =====================================
           RESPONSE
        ===================================== */

        return res.json({

            success: true,

            year,

            month,

            calendar

        });

    } catch (error) {

        console.error(
            "Calendar Error:",
            error
        );


        return res.status(500).json({

            success: false,

            message: "Failed to load calendar",

            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined

        });

    }

};


module.exports = {

    getCalendar

};