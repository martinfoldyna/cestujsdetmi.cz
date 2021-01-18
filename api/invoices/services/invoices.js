'use strict';
const Docxtemplater = require("docxtemplater");
const PizZip = require("pizzip");
const fs = require("fs");
const path = require("path")
const {v4} = require("uuid")
const libre = require('libreoffice-convert');
const { jsPDF } = require("jspdf/dist/jspdf.node");
const {applyPlugin} = require("jspdf-autotable/dist/jspdf.plugin.autotable")


/**
 * `invoices` service.
 */

module.exports = {
  // exampleService: (arg1, arg2) => {
  //   return isUserOnline(arg1, arg2);
  // }
  create: (reqData) => {
    applyPlugin(jsPDF)

    const doc = new jsPDF();
    doc.autoTable({head: [["ID", "Name", "Email", "Country"]], body: [
      ["1", "Martin", "martin.foldyna@me.com", "Czechia"],
      ["2", "Robert", "robertIsDick@gmail.com", "Germany"],
      ]})
    const data = doc.output()
    fs.writeFileSync("./docuemnt.pdf", data, "binary")

  },
  createFromDocx: (data) => {

    function replaceErrors(key, value) {
      if (value instanceof Error) {
        return Object.getOwnPropertyNames(value).reduce(function(error, key) {
          error[key] = value[key];
          return error;
        }, {});
      }
      return value;
    }

    function errorHandler(error) {
      console.log(JSON.stringify({error: error}, replaceErrors));

      if (error.properties && error.properties.errors instanceof Array) {
        const errorMessages = error.properties.errors.map(function (error) {
          return error.properties.explanation;
        }).join("\n");
        console.log('errorMessages', errorMessages);
        // errorMessages is a humanly readable message looking like this :
        // 'The tag beginning with "foobar" is unopened'
      }
      throw error;
    }


    const content = fs.readFileSync(path.resolve(__dirname, "invoice_template.docx"), "binary")
    const zip = new PizZip(content);
    let doc;
    try {
      doc = new Docxtemplater(zip);
    } catch (err) {
      errorHandler(err)
    }
    doc.setData({
      InvoiceDate: new Date(),
      InvoiceNumb: Math.floor(Math.random() * 10000),
      CustomNumber: "Martin Foldyna",
      CompanyName: "Monium",
      AddressLine1: "Přípotoční 957/11",
      City: "Praha",
      State: "Česko",
      Zip: "101 00",
      Country: "Česká republika",
      CustomerPhone: "+420725811823",
      CustomerId: v4(),
      Items: [
        {
          Item_Qty: "1",
          Item_Number: v4(),
          Item_Description: "ApartHotel Jablonec - druh zápisu: Premium Gold",
          Item_Price: "1 490,-",
        },
        {
          Item_Qty: "1",
          Item_Number: v4(),
          Item_Description: "Restaurant 59 - druh zápisu: Premium Gold",
          Item_Price: "1 490,-",
        },
      ],
      TotalEx: "2 980,-",
      SalesTax: "25%",
      TotalPrice: "3 725,-"
    });
    try {
      doc.render()
    } catch (err) {
      errorHandler(err)
    }
    const buf = doc.getZip().generate({type: "nodebuffer"})
    const file = fs.readFileSync(path.resolve(__dirname, "invoice_template.docx"))

    libre.convert(file, ".pdf", undefined, (err, done) => {
      if (err) {
        console.log(`Err while converting file: ${err}`)
      }

      fs.writeFileSync( "example.pdf", done);
    })
  }
};
