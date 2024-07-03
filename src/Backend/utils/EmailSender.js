const dotenv = require("dotenv");
const nodemailer = require("nodemailer");
const fs = require("fs");
const path = require("path");

dotenv.config({ path: '../.env' });

// SMTP details
const gmailSMTPDetails = {
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
}

function updateTemplate(content, emailObject){
    let keysArr = Object.keys(emailObject);
    keysArr.forEach((key) => {
        content = content.replace(`#{${key}}`, emailObject[[key]]);
    });
    return content;
}

async function emailSender(template, receiverEmail, subject, emailObject){
    try{

        const templatePath = path.join(__dirname, 'email_templates', template);
        const content = await fs.promises.readFile(templatePath, 'utf-8');
        const finalEmailContent = updateTemplate(content, emailObject);

        const msg = {
            to: receiverEmail, // Change to your recipient
            from: 'joljoltuni@gmail.com', // Change to your verified sender
            subject: subject,
            text: subject,
            html: finalEmailContent
        }
        
        const transporter = nodemailer.createTransport(gmailSMTPDetails);
        
        const info = await transporter.sendMail(msg);
       

    } catch (err){
        console.log("email failure error", err);
    }        

}

module.exports = emailSender;

