"use strict";
const { emailConfig } = require("../../../config/emailTemplates");

/**
 * A set of functions called "actions" for `email`
 */

module.exports = {
  sendPlainEmail: async (ctx, next) => {
    strapi.log.debug(`Trying to send an email to martifoldyna@gmail.com`);

    try {
      const emailOptions = {
        to: "martifoldyna@gmail.com",
        subject: "Email with template",
        html: emailConfig.html,
      };
      await strapi.plugins["email"].services.email.send(emailOptions);
      strapi.log.debug(`Email sent to martifoldyna@gmail.com`);
      ctx.send({ message: `Email sent` });
    } catch (err) {
      strapi.log.error(`Error sending email to martifoldyna@gmail.com`, err);
      ctx.send({ error: "Error sending email" });
    }
  },
  sendInvoice: async (ctx, next) => {
    const { body } = ctx.request;
    const sendTo = body.email;
    strapi.log.debug(`Trying to send an email to ${sendTo}`);

    try {
      const file = await strapi.services.invoices.create(body);
      const emailOptions = {
        to: sendTo,
        subject: "Happy new year!",
        html: `<h1>Welcome!</h1><p>This is a test HTML email.</p>`,
        attachments: [
          {
            filename: "file.pdf",
            content: file,
          },
        ],
      };
      await strapi.plugins["email"].services.email.send(emailOptions);
      strapi.log.debug(`Email sent to ${sendTo}`);
      ctx.send({ message: `Email sent` });
    } catch (err) {
      strapi.log.error(`Error sending email to ${sendTo}`, err);
      ctx.send({ error: "Error sending email" });
    }
  },
  createObjektInquiry: async (ctx, next) => {
    try {
      const { body } = ctx.request;
      const objekty = await strapi.query("objekt-info").model.find(
        {
          kraj: ctx.request.body.kraj,
          kategorie_value: ctx.request.body.kategorie_value,
          email: { $ne: null },
        },
        "-statistiky -provozni_doba -slevy -dostupnost -ceny -vnejsi_vybaveni -vnitrni_vybaveni -relative_galerie -vnitrni_vybaveni_popis -vnejsi_vybaveni_popis -last_minute_odkaz -last_minute_popis -zajimavosti -web -telefon -popis -kraj_id -last_minute -uzivatel -active -druh_zapisu -galerie -updated_at -created_at -active_until -page_keywords -page_description -page_title -zakladni_popis -podkategorie_value -kategorie_value -gps -adresa_ulice -nazev -hlavni_kategorie -adresa -podkategorie -recenze -__v -kraj -mesto -oblast -updated_by"
      );
      console.log(objekty.map((objekt) => objekt.email));
      const emailOptions = {
        as: "Cestuj s dětmi.cz",
        to: ["martin.foldyna@me.com", "matyas.jbc@gmail.com"],
        subject: "Máte novou poptávku z portálu cestujsdetmi.cz",
        html: emailConfig.inquiry({
          name: `${body.name} ${body.surname}`,
          email: body.email,
          phone: body.phone,
          message: body.question,
        }),
      };
      await strapi.plugins["email"].services.email.send(emailOptions);
      strapi.log.debug(`Email sent to ${body.email}`);
      ctx.send({ message: `Email sent` });

      ctx.send({ message: `Fuck` });
    } catch (err) {
      strapi.log.error(`Error sending email`, err);
      ctx.send({ error: "Error sending email" });
    }
  },
};
