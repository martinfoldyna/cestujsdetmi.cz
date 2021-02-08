'use strict';
const axios = require("axios");
const xml2js = require("xml2js")


/**
 * Read the documentation (https://strapi.io/documentation/v3.x/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

const previoUrl = "https://api.previo.cz/x1"

const parseXml = (xml) => {
  const parser = new xml2js.Parser({ explicitArray: false });

  return new Promise((resolve, reject) => {
    parser.parseString(xml, (err, result) => {
      if (err) {
        reject(err);
      }
      resolve(result);
    });
  });
};

const xmlifyParams = (params) => {
  let xmlString = "";
  for (let param in params) {
    if (typeof params[param] === "object") {
      xmlString += `<${param}>`;
      for (let subParam in params[param]) {
        xmlString += `<${subParam}>${params[param][subParam]}</${subParam}>`;
      }
      xmlString += `</${param}>`;
    } else {
      xmlString += `<${param}>${params[param]}</${param}>`;
    }
  }

  return xmlString;
};

module.exports = {

  async getHotelProperties(ctx) {
    const xmlSring = `<?xml version="1.0"?>
      <request>
        <login>${process.env.PREVIO_LOGIN}</login>
        <password>${process.env.PREVIO_PASSWORD}</password>
        <lanId>1</lanId>
      </request>`;

    // Previo api call, to allow CORS in development add cors-anywhere domain before previo url
    const response = await axios.post(
      `${previoUrl}/system/getHotelProperties`,
      xmlSring,
      {
        headers: {
          "Content-Type": "text/plain",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );

    const jsonData = await parseXml(response.data);
    return { data: jsonData };

  },
  /**
   * Reusable call to Previo API
   * @param ctx: path param of previo API call
   * @returns Parsed JSON response from previo
   */
  async fetchPrevio(ctx) {

    try {
      const {query, params} = ctx
      // const {params, path} = ctx.body;
      const {path} = params;
      console.log(query)

      // Final xml request string
      const xmlSring = `<?xml version="1.0"?>
      <request>
        <login>${process.env.PREVIO_LOGIN}</login>
        <password>${process.env.PREVIO_PASSWORD}</password>
        <lanId>1</lanId>
        ${query ? xmlifyParams(query) : ""}
      </request>`;

      // Previo api call, to allow CORS in development add cors-anywhere domain before previo url
      const response = await axios.post(
          `${previoUrl}/${path}`,
        xmlSring,
        {
          headers: {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      // Conver xml string to JSON
      const jsonData = await parseXml(response.data);

      return { success: true, data: jsonData };
    } catch (err) {
      console.log(err);
      throw err
    }
  },
  /**
   * Fetch hotels within given limit
   * @param limit {number} how many hotels to fetch
   * @returns {Promise<{data: *, success: boolean}>}
   */
  async fetchAllHotels(ctx) {
    try {
      const {limit} = ctx.params;
      const xmlSring = `<?xml version="1.0"?>
      <request>
        <login>${process.env.PREVIO_LOGIN}</login>
        <password>${process.env.PREVIO_PASSWORD}</password>
        <limit><limit>${limit}</limit></limit>
        <filter>
          <in>
              <field>collaboration</field>
              <value>active</value>
          </in>
          <in>
              <field>couId</field>
              <value>1</value>

          </in>
        </filter>
        <order>
            <by>name</by>
            <desc>false</desc>
        </order>
      </request>`;

      // Previo api call, to allow CORS in development add cors-anywhere domain before previo url
      const response = await axios.post(
        `${previoUrl}/hotels/search`,
        xmlSring,
        {
          headers: {
            "Content-Type": "text/plain",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );

      // Conver xml string to JSON
      const jsonData = await parseXml(response.data);


      return { success: true, data: jsonData.hotels.hotel };
    } catch (err) {
      console.log(err);
    }
  }
};
