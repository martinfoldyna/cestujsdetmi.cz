'use strict';

/**
 * Cron config that gives you an opportunity
 * to run scheduled jobs.
 *
 * The cron format consists of:
 * [SECOND (optional)] [MINUTE] [HOUR] [DAY OF MONTH] [MONTH OF YEAR] [DAY OF WEEK]
 *
 * See more details here: https://strapi.io/documentation/v3.x/concepts/configurations.html#cron-tasks
 */

const checkSoonToExpire = async () => {
  // Create todays string
  const today = new Date()

  // Functions that adds months to specific date
  const addMonths = (date, month) => {
    const newDate = new Date(date);
    return new Date(newDate.setMonth(newDate.getMonth() + month));
  }

  const startDate = addMonths(today, 3);

  // Generate FROM / start date in the correct format
  const startDateString = new Date(new Date(`${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`).setHours(0, 0, 0));
  console.log("startDate", startDateString)
  console.log("today", today)
  // Generate TO / end date in the correct format
  const endDateString = new Date(new Date(`${startDate.getFullYear()}-${startDate.getMonth()+1}-${startDate.getDate()}`).setHours(23, 59, 59))
  console.log("endDate", endDateString)


  // const entities = await strapi.services["objekt-info"].find({createdAt_gte: startDateString, createdAt_lt: endDateString});
  return await strapi.services["objekt-info"].find({active_until_gte: startDateString, active_until_lt: endDateString});

}

module.exports = {
  /**
   * Simple example.
   * Every monday at 1am.
   */
  // '0 1 * * 1': () => {
  //
  // }
  // '*/10 * * * * *': () => {
  //   const today = new Date()
  //   console.log(`Good morning, local time is: ${today.getHours()}:${today.getMinutes() < 10 ? '0' + today.getMinutes() : today.getMinutes()}`)
  // },
  // '*/20 * * * * *': async () => {
  //   const checkObjects = await checkSoonToExpire();
  //   console.log(checkObjects.map(entitity => entitity.email))
  //   const emailOptions = {
  //     to: checkObjects[0].email,
  //     subject: "Brzy vám skončí předplatné!",
  //     html: `<p>Vašem objektu, který máte na naší stránce v zápisu ${checkObjects[0].druh_zapisu} za 3 měsíce skončí předplatné. Nechetli, aby váš objekt byl změnen do zápisu standard obnovte si vaše předplatné <a href="http://localhost:3333/api/login">zde</a>.</p>`,
  //   }
  //   await strapi.plugins["email"].services.email.send(emailOptions);
  //   strapi.log.debug(`Email sent to ${checkObjects[0].email}`)
  // },
  // '0 */1 * * *': async () => {
  //   const response = await strapi.services.rss.fetchRSSandSave();
  //   console.log(response);
  //   console.warn("call rss function")
  // }
};
