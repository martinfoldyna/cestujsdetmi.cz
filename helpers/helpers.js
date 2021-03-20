// module.exports.convertToValue = (string) => {
//   const removeBlanks = string.replace(" ", "-");
//   return  removeBlanks.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
// }

const xml2js = require("xml2js")

module.exports = {
  parseXml: async (xml) => {
    const parser = new xml2js.Parser({ explicitArray: false });

    return new Promise((resolve, reject) => {
      parser.parseString(xml, (err, result) => {
        if (err) {
          reject(err);
        }
        resolve(result);
      });
    });
  },
  convertToValue: (string) => {
    const removeBlanks = string.replace(" ", "-");
    return  removeBlanks.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
}
