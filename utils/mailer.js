var _ = require('lodash');	
var nodemailer = require('nodemailer');
var fs = require('fs');

var config = {
    host: 'smtp.office365.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'pintcolectionpoint@outlook.com',
        pass: 'Ala55553333'
    }
};
    
var transporter = nodemailer.createTransport(config);

var defaultMail = {
    from: 'pintcolectionpoint@outlook.com',
    text: 'test text',
};

module.exports = function(mail, confirmationLink){
    // use default settings
    mail = _.merge({}, defaultMail, mail);

    // Read HTML template content from file
    var templatePath = 'views/new-email.html';
    fs.readFile(templatePath, 'utf8', function(err, templateContent) {
        if (err) {
            console.error('Error reading email template:', err);
            return;
        }

        // Replace the placeholder with the confirmation link
        var updatedHtml = templateContent.replace('{{ confirmationLink }}', confirmationLink);

        // Set updated HTML content
        mail.html = updatedHtml;

        // Send email
        transporter.sendMail(mail, function(error, info){
            if(error) return console.log(error);
            console.log('Mail sent:', info.response);
        });
    });
};
