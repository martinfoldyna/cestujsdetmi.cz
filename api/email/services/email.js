const nodemailer = require("nodemailer")

/**
 * `email` service.
 */

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'martifoldyna@gmail.com',
    pass: 'Martin13062',
  },
});

module.exports = {
  // exampleService: (arg1, arg2) => {
  //   return isUserOnline(arg1, arg2);
  // }
  send: (from, to, subject, text) => {
    // Setup e-mail data.
    const options = {
      from,
      to,
      subject,
      text,
    };

    // Return a promise of the function that sends the email.
    return transporter.sendMail(options);
  },
};
