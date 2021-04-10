'use strict';
const {emailConfig} = require("../../../config/emailTemplates")

/**
 * A set of functions called "actions" for `email`
 */

module.exports = {
  sendPlainEmail: async (ctx, next) => {
    strapi.log.debug(`Trying to send an email to martifoldyna@gmail.com`)

    try {
      const emailOptions = {
        to: "martifoldyna@gmail.com",
        subject: "Email with template",
        html: emailConfig.html,
      }
      await strapi.plugins["email"].services.email.send(emailOptions);
      strapi.log.debug(`Email sent to martifoldyna@gmail.com`)
      ctx.send({message: `Email sent`})
    } catch (err) {
      strapi.log.error(`Error sending email to martifoldyna@gmail.com`, err)
      ctx.send({ error: 'Error sending email' })
    }
  },
  sendInvoice: async (ctx, next) => {
    const {body} = ctx.request;
    const sendTo = body.email;
    strapi.log.debug(`Trying to send an email to ${sendTo}`)

    try {
      const file = await strapi.services.invoices.create(body);
      const emailOptions = {
        to: sendTo,
        subject: "Happy new year!",
        html: `<h1>Welcome!</h1><p>This is a test HTML email.</p>`,
        attachments: [
          {
            filename: "file.pdf",
            content: file
          }
        ]
      }
      await strapi.plugins["email"].services.email.send(emailOptions);
      strapi.log.debug(`Email sent to ${sendTo}`)
      ctx.send({message: `Email sent`})
    } catch (err) {
      strapi.log.error(`Error sending email to ${sendTo}`, err)
      ctx.send({ error: 'Error sending email' })
    }
  },
  createObjektInquiry: async (ctx, next) => {
    const query = ctx.query;

    console.log(query)
  }
};
