const bcrypt = require("bcrypt");

const password = "user";

const hash = "$$2b$10$wGd4ezeB0oiCkPdYPXRP0eV5l/v5tsNGRex5lmnEb/V4.MsHxhI7u";


bcrypt.hash(password, 10, (err, hash) => {
    if (err) {
        console.error(err);
        return;
    }

    console.log(hash);
});

// bcrypt.compare(password, hash, (err, result) => {

//     if (err) {
//         console.error(err);
//         return;
//     }

//     console.log("Password match:", result);
// });

// INSERT INTO users
// (name, email, mobile_number, password, role)
// VALUES
// (
//     'user',
//     'user@gmail.com',
//     '9876543210',
//     '$2b$10$1qnjGx/bGtq04hKsgH40nOmXJ/qcgQDM9lpbb0eCJSB3IxtW8FktO',
//     'student'
// );