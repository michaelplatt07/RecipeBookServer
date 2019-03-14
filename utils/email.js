/**
 * @author: MAPlatt
 * @date: 2019-03-14
 * @license:
 */
const config = require("config"),
      debug = require('debug')('email'),
      nodemailer = require("nodemailer");

exports.sendEmail = (recipientAddress, subject, body) => {
    debug("In sendEmail");
    
    // Build email and send it out
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: config.get('emailConfig.emailAddress'),
            pass: config.get('emailConfig.emailPassword')
        }
    });
    var mailOptions = {
        from: 'nararecipeapp@gmail.com',
        to: recipientAddress,
        subject: subject,
        text: body
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    }); 

};
