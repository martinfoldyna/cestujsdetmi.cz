// 'use strict';
const {invoiceTemplate} = require("./templates/templates");

const pdfmake = require("pdfmake");
const Roboto = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf'
  }
}
// pdfmake.addFonts(Roboto);


/**
 * `invoices` service.
 */

module.exports = {
  // exampleService: (arg1, arg2) => {
  //   return isUserOnline(arg1, arg2);
  // }
  create: async (data) => {

    // try here http://pdfmake.org/playground.html

    try {
      const printer = new pdfmake(Roboto);

      const docDefinition = await invoiceTemplate(data)

      const pdfDoc = await printer.createPdfKitDocument(docDefinition);
      // pdfDoc.pipe(fs.createWriteStream(`invoice02.pdf`))
      // pdfDoc.end()
      return pdfDoc;
    } catch (err) {
      throw err
    }

  },

};
