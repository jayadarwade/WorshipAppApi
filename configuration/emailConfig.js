const dotenv = require('dotenv')
dotenv.config()
const nodemailer = require('nodemailer')

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",           //process.env.EMAIL_HOST,
    port: 465,                       //process.env.EMAIL_PORT
    secure: true,                    // true for 465, false for other ports
    auth: {
        user: 'anjalitomarbk4@gmail.com',   // Admin Gmail ID  process.env.EMAIL_USER,
        pass: "Shivpit@4",      // Admin Gmail Password   process.env.EMAIL_PASS,
    },
})

module.exports = transporter;