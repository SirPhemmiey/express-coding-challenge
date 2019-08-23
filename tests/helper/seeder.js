const mongoose = require('mongoose');
const { User } = require('../../models/user');
const { Book } = require('../../models/book');
const { Institution } = require('../../models/institution');

require('dotenv').config();

//mongoose.connect(process.env.MONGODB_URL)

User.collection.drop();
Book.collection.drop();
Institution.collection.drop();

Institution.create([{
    name: "Kwara State University",
    url: "https://kwasu.edu.ng",
    emailDomain: "kwasu.edu.ng"
}]).then(institution => {
    console.log("Institution was created")
}).catch(error => {
    console.log({ error })
});

// User.create([{
//         name: 'Peter John',
//         email: 'peterjohn@kwasu.edu.ng',
//         role: 'student',
//         password: '12345'
//     },
//     {
//         name: 'Peter Peter',
//         email: 'peterpeter@kwasu.edu.ng',
//         role: 'student',
//         password: '12345'
//     }
// ]).then(user => {
//     console.log("User was created")
// }).catch(error => {
//     console.log({ error })
// });