var Mailgun = require('mailgun').Mailgun;
class Mail {
    constructor(apiKey) {
        this.mg = new Mailgun(apiKey);
    }
    sendText(subject, message, listRecipient) {

        this.mg.sendText('fandzaz@gmail.com', listRecipient, subject, message, 'noreply@example.com', {}, (err) => {
            if (err);
            else {
                console.log('send success');
            }
        })
    }
}
module.exports = Mail;