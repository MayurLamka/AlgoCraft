const Note = require("../models/Note");


/* =========================================
   GET ALL SUBJECTS
========================================= */

const getAllSubjects = (req, res) => {

    Note.getAllSubjects(
        (err, results) => {

            if (err) {

                console.error(
                    "Failed to fetch note subjects:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch note subjects"
                });
            }


            res.status(200).json({
                success: true,
                subjects: results
            });

        }
    );

};


/* =========================================
   GET FILES
========================================= */

const getFilesBySubject = (req, res) => {

    const { subjectId } = req.params;


    Note.getFilesBySubject(
        subjectId,
        (err, results) => {

            if (err) {

                console.error(
                    "Failed to fetch note files:",
                    err
                );

                return res.status(500).json({
                    success: false,
                    message: "Failed to fetch note files"
                });
            }


            res.status(200).json({
                success: true,
                files: results
            });

        }
    );

};


module.exports = {
    getAllSubjects,
    getFilesBySubject
};