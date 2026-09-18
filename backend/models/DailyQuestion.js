const db = require("../config/db");

const DailyQuestion = {

    /* =========================================
       GET CALENDAR QUESTIONS
    ========================================= */

    async getCalendarQuestions(year, month, userId) {

        const startDate =
            `${year}-${String(month).padStart(2, "0")}-01`;

        const lastDay =
            new Date(year, month, 0).getDate();

        const endDate =
            `${year}-${String(month).padStart(2, "0")}-${String(lastDay).padStart(2, "0")}`;


        const sql = `
            SELECT
                dq.calendar_date,
                dq.question_id,
                q.title,
                q.difficulty,

                CASE
                    WHEN sq.question_id IS NOT NULL
                    THEN 1
                    ELSE 0
                END AS isSolved

            FROM daily_questions dq

            INNER JOIN questions q
                ON q.question_id = dq.question_id

            LEFT JOIN solved_questions sq
                ON sq.question_id = dq.question_id
                AND sq.user_id = ?

            WHERE dq.calendar_date BETWEEN ? AND ?

            ORDER BY dq.calendar_date ASC
        `;


        return new Promise((resolve, reject) => {

            db.query(
                sql,
                [userId, startDate, endDate],
                (error, results) => {

                    if (error) {
                        reject(error);
                        return;
                    }

                    resolve(results || []);

                }
            );

        });

    },


    /* =========================================
       GENERATE MISSING DAILY QUESTIONS
    ========================================= */

    async generateMissingDates(year, month) {

        const startDate =
            new Date(year, month - 1, 1);

        const endDate =
            new Date(year, month, 0);


        /* =====================================
           GET ALL QUESTIONS
        ===================================== */

        const questions = await new Promise(
            (resolve, reject) => {

                db.query(
                    `
                    SELECT question_id
                    FROM questions
                    ORDER BY question_id ASC
                    `,
                    (error, results) => {

                        if (error) {
                            reject(error);
                            return;
                        }

                        resolve(results || []);

                    }
                );

            }
        );


        if (!questions.length) {

            console.log(
                "No questions found for calendar."
            );

            return;

        }


        /* =====================================
           GENERATE DATES
        ===================================== */

        for (
            let date = new Date(startDate);
            date <= endDate;
            date.setDate(date.getDate() + 1)
        ) {

            const dateString =
                `${date.getFullYear()}-${String(
                    date.getMonth() + 1
                ).padStart(2, "0")}-${String(
                    date.getDate()
                ).padStart(2, "0")}`;


            /* =================================
               CREATE STABLE QUESTION INDEX

               Jan 1 2026 → Question 1
               Jan 2 2026 → Question 2
               Jan 3 2026 → Question 3
               ...
            ================================= */

            const baseDate =
                new Date(2026, 0, 1);

            const currentDate =
                new Date(
                    date.getFullYear(),
                    date.getMonth(),
                    date.getDate()
                );


            const difference =
                Math.floor(
                    (
                        currentDate.getTime() -
                        baseDate.getTime()
                    ) /
                    (1000 * 60 * 60 * 24)
                );


            const questionIndex =
                (
                    difference %
                    questions.length +
                    questions.length
                ) %
                questions.length;


            const question =
                questions[questionIndex];


            /* =================================
               INSERT ONLY IF DATE DOESN'T EXIST
            ================================= */

            await new Promise(
                (resolve, reject) => {

                    db.query(
                        `
                        INSERT IGNORE INTO daily_questions
                        (
                            calendar_date,
                            question_id
                        )
                        VALUES (?, ?)
                        `,
                        [
                            dateString,
                            question.question_id
                        ],
                        (error) => {

                            if (error) {
                                reject(error);
                                return;
                            }

                            resolve();

                        }
                    );

                }
            );

        }

    }

};


module.exports = DailyQuestion;