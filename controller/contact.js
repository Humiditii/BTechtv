const nodemailer = require('nodemailer');
const sendGridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: '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',
    }
}));
exports.contactUs = (req, res, next) => {
    const reqName = req.body.name;
    const reqPhone = req.body.phone;
    const reqMessage = req.body.message;

    const sub = reqMessage.slice(0,10);
    const adminMail = 'btechtv19@gmail.com';

    return transporter.sendMail({
        to: adminMail,
        from: reqPhone + '  ' + reqName,
        subject: sub,
        html: ' <h1>Name is'+ reqName+'</h1><p>'+reqMessage+'</p>'
    }).then( success => {
        console.log('DONE');
        res.redirect('/contact?msg=sent');
    }).catch( err => {
        console.log(" An error occured "+err);
    });

}