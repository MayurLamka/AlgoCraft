const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// ======================================
// Register User
// ======================================
const register = (req, res) => {

    const {
        name,
        email,
        mobile_number,
        password
    } = req.body;


    // Check required fields
    if (!name || !email || !mobile_number || !password) {
        return res.status(400).json({
            success: false,
            message: "Please fill all fields"
        });
    }


    // Check if email already exists
    User.findByEmail(email, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }


        if (results.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Email already exists"
            });
        }


        // Hash password
        bcrypt.hash(password, 10, (err, hashedPassword) => {

            if (err) {
                console.error(err);

                return res.status(500).json({
                    success: false,
                    message: "Password hashing failed"
                });
            }


            // Insert user
            User.createUser(
                name,
                email,
                mobile_number,
                hashedPassword,
                (err, result) => {

                    if (err) {
                        console.error(err);

                        return res.status(500).json({
                            success: false,
                            message: "Registration Failed"
                        });
                    }


                    res.status(201).json({
                        success: true,
                        message: "User Registered Successfully"
                    });

                }
            );

        });

    });

};


// ======================================
// Login User
// ======================================
const login = (req, res) => {

    const {
        email,
        password
    } = req.body;


    // Check required fields
    if (!email || !password) {

        return res.status(400).json({
            success: false,
            message: "Please enter email and password"
        });

    }


    // Find user
    User.findByEmail(email, (err, results) => {

        if (err) {
            console.error(err);

            return res.status(500).json({
                success: false,
                message: "Database Error"
            });
        }


        // User not found
        if (results.length === 0) {

            return res.status(401).json({
                success: false,
                message: "Invalid Email or Password"
            });

        }


        const user = results[0];


    
        
        // Compare password
        bcrypt.compare(
            password,
            user.password,
            (err, isMatch) => {

                console.log("BCRYPT RESULT:", isMatch);
                if (err) {
                    console.error(err);

                    return res.status(500).json({
                        success: false,
                        message: "Password verification failed"
                    });
                }


                // Password incorrect
                if (!isMatch) {

                    return res.status(401).json({
                        success: false,
                        message: "Invalid Email or Password"
                    });

                }


                // Create JWT
                const token = jwt.sign(
                    {
                        user_id: user.user_id,
                        role: user.role
                    },
                    process.env.JWT_SECRET,
                    {
                        expiresIn:
                            process.env.JWT_EXPIRES_IN || "1d"
                    }
                );


                // Login successful
                res.status(200).json({

                    success: true,

                    message: "Login Successful",

                    token: token,

                    user: {
                        user_id: user.user_id,
                        name: user.name,
                        email: user.email,
                        mobile_number: user.mobile_number,
                        role: user.role
                    }

                });

            }
        );

    });

};


module.exports = {
    register,
    login
};

