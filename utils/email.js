/**
 * @author: MAPlatt
 * @date: 2019-03-14
 * @license:
 */
const config = require("config"),
      debug = require('debug')('email'),
      nodemailer = require("nodemailer");

exports.sendEmail = (recipientAddress, subject, body, insertedId) => {
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
        text: body,
        html: getActivationEmailTemplate(insertedId),
        attachments: [{
            filename: 'cherry_blossom_sky.png',
            path: '/home/michael/Desktop/Programming/RecipeApp/RecipeBookServer/consts/cherry_blossom_sky.png',
            cid: 'blossom'
        }]
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            debug('Email sent: ' + info.response);
        }
    }); 

};

const getActivationEmailTemplate = (mongoId) => {
    return `
<style>
  @media (max-device-width: 479px) {

  .header-image
  {
  height: 200px;
  width: 100%;
  }
  
  .body-div
  {
  width: 100%;
  text-align: center
  }

  .activate-div
  {
  margin: 10px;
  padding: 20px;  
  }

  .activate-link
  {
  padding: 20px;
  background-color: rgb(255, 183, 197);
  border: 5px solid rgb(205, 133, 157);
  border-radius: 10px;
  color: black;
  cursor: pointer;
  box-shadow: 5px 5px 5px 0px rgb(185, 113, 137);
  }

  }

  @media (min-device-width: 480px) {

  .header-image
  {
  height: 400px;
  width: 100%;
  }

  .body-div
  {
  width: 100%;
  text-align: center
  }

  .activate-div
  {
  margin: 10px;
  padding: 20px;  
  }

  .activate-link
  {
  padding: 20px;
  background-color: rgb(255, 183, 197);
  border: 5px solid rgb(205, 133, 157);
  border-radius: 10px;
  color: black;
  cursor: pointer;
  box-shadow: 5px 5px 5px 0px rgb(185, 113, 137);
  }

  }
</style>
<div>
  <img src="cid:blossom" alt="Cherry Blossom" class="header-image"> 
</div>
<div class="body-div">
  <h3><b>**ALERT** DO NOT REPLY TO THIS EMAIL **ALERT**</b></h3>
  <div>Click on the link below to activate your account:</div>
  <div class="activate-div">
    <a class="activate-link" href="${config.get("serverConfig.baseUrl")}:${config.get("serverConfig.basePort")}/users/activate/${mongoId}">
      Tap to Activate
    </a>
    <p>
      Thank you for joining NARA.
      Please verify your email address.
    </p>
    <p>
      FOLLOW US AT:
    </p>
  </div>
</div>
`;
};
