module.exports.invoiceTemplate = async (data) => {
  let subtotalPrice = 0;
  data.items.forEach(item => {
    subtotalPrice += item.cena
  })
  const today = new Date()
  return {
    content: [
      {
        columns: [
          {
            image:
              "logo.png",
            width: 150,
          },
          [
            {
              text: "Faktura",
              color: "#333333",
              width: "*",
              fontSize: 28,
              bold: true,
              alignment: "right",
              margin: [0, 0, 0, 15],
            },
            {
              stack: [
                {
                  columns: [
                    {
                      text: "Číslo faktury",
                      color: "#aaaaab",
                      bold: true,
                      width: "*",
                      fontSize: 12,
                      alignment: "right",
                    },
                    {
                      text: "00001",
                      bold: true,
                      color: "#333333",
                      fontSize: 12,
                      alignment: "right",
                      width: 100,
                    },
                  ],
                },
                {
                  columns: [
                    {
                      text: "Vystaveno dne",
                      color: "#aaaaab",
                      bold: true,
                      width: "*",
                      fontSize: 12,
                      alignment: "right",
                    },
                    {
                      text: `${today.getDay()}.${
                        today.getMonth() + 1
                      }.${today.getFullYear()}`,
                      bold: true,
                      color: "#333333",
                      fontSize: 12,
                      alignment: "right",
                      width: 100,
                    },
                  ],
                },
                // {
                //   columns: [
                //     {
                //       text: 'Status',
                //       color: '#aaaaab',
                //       bold: true,
                //       fontSize: 12,
                //       alignment: 'right',
                //       width: '*',
                //     },
                //     {
                //       text: 'PAID',
                //       bold: true,
                //       fontSize: 14,
                //       alignment: 'right',
                //       color: 'green',
                //       width: 100,
                //     },
                //   ],
                // },
              ],
            },
          ],
        ],
      },
      {
        columns: [
          {
            text: "Dodavatel",
            color: "#aaaaab",
            bold: true,
            fontSize: 14,
            alignment: "left",
            margin: [0, 20, 0, 5],
          },
          {
            text: "Zákazník",
            color: "#aaaaab",
            bold: true,
            fontSize: 14,
            alignment: "left",
            margin: [0, 20, 0, 5],
          },
        ],
      },
      {
        columns: [
          {
            text: `${
              data.name ? "Aleš Procházka \n" : ""
            } Cestuj s dětmi.cz`,
            bold: true,
            color: "#333333",
            alignment: "left",
          },
          {
            text: `${data.name ? `${data.name} \n` : ""} ${data.company}`,
            bold: true,
            color: "#333333",
            alignment: "left",
          },
        ],
      },
      {
        columns: [
          {
            text: "Adresa",
            color: "#aaaaab",
            bold: true,
            margin: [0, 7, 0, 3],
          },
          {
            text: "Adresa",
            color: "#aaaaab",
            bold: true,
            margin: [0, 7, 0, 3],
          },
        ],
      },
      {
        columns: [
          {
            text:
              "Svatopluka Čecha \n Jablonec nad Nisou 00000 \n Česká republika",
            style: "invoiceBillingAddress",
          },
          {
            text: `${data.address} \n ${
              data.city + " " + data.zipCode
            } \n ${data.country}`,
            style: "invoiceBillingAddress",
          },
        ],
      },
      "\n\n",
      // {
      //   width: "100%",
      //   alignment: "center",
      //   text: "Číslo faktury 123",
      //   bold: true,
      //   margin: [0, 10, 0, 10],
      //   fontSize: 15,
      // },
      {
        layout: {
          defaultBorder: false,
          hLineWidth: function (i, node) {
            return 1;
          },
          vLineWidth: function (i, node) {
            return 1;
          },
          hLineColor: function (i, node) {
            if (i === 1 || i === 0) {
              return "#bfdde8";
            }
            return "#eaeaea";
          },
          vLineColor: function (i, node) {
            return "#eaeaea";
          },
          hLineStyle: function (i, node) {
            // if (i === 0 || i === node.table.body.length) {
            return null;
            //}
          },
          // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          paddingLeft: function (i, node) {
            return 10;
          },
          paddingRight: function (i, node) {
            return 10;
          },
          paddingTop: function (i, node) {
            return 2;
          },
          paddingBottom: function (i, node) {
            return 2;
          },
          fillColor: function (rowIndex, node, columnIndex) {
            return "#fff";
          },
        },
        table: {
          headerRows: 1,
          widths: ["*", 80],
          body: [
            [
              {
                text: "Popis produktu",
                fillColor: "#eaf2f5",
                border: [false, true, false, true],
                margin: [0, 5, 0, 5],
                textTransform: "uppercase",
              },
              {
                text: "Cena produktu",
                border: [false, true, false, true],
                alignment: "right",
                fillColor: "#eaf2f5",
                margin: [0, 5, 0, 5],
                textTransform: "uppercase",
              },
            ],
            ...data.items.map((item) => [
              {
                text: `${item.nazev} - ${item.druh_zapisu}`,
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
                alignment: "left",
              },
              {
                border: [false, false, false, true],
                text: `${item.cena}`,
                fillColor: "#f5f5f5",
                alignment: "right",
                margin: [0, 5, 0, 5],
              },
            ]),
          ],
        },
      },
      "\n",
      "\n\n",
      {
        layout: {
          defaultBorder: false,
          hLineWidth: function (i, node) {
            return 1;
          },
          vLineWidth: function (i, node) {
            return 1;
          },
          hLineColor: function (i, node) {
            return "#eaeaea";
          },
          vLineColor: function (i, node) {
            return "#eaeaea";
          },
          hLineStyle: function (i, node) {
            // if (i === 0 || i === node.table.body.length) {
            return null;
            //}
          },
          // vLineStyle: function (i, node) { return {dash: { length: 10, space: 4 }}; },
          paddingLeft: function (i, node) {
            return 10;
          },
          paddingRight: function (i, node) {
            return 10;
          },
          paddingTop: function (i, node) {
            return 3;
          },
          paddingBottom: function (i, node) {
            return 3;
          },
          fillColor: function (rowIndex, node, columnIndex) {
            return "#fff";
          },
        },
        table: {
          headerRows: 1,
          widths: ["*", "auto"],
          body: [
            [
              {
                text: "Cena bez DPH",
                border: [false, true, false, true],
                alignment: "right",
                margin: [0, 5, 0, 5],
              },
              {
                border: [false, true, false, true],
                text: `${subtotalPrice},-`,
                alignment: "right",
                fillColor: "#f5f5f5",
                margin: [0, 5, 0, 5],
              },
            ],
            [
              {
                text: "DPH",
                border: [false, false, false, true],
                alignment: "right",
                margin: [0, 5, 0, 5],
              },
              {
                text: "25%",
                border: [false, false, false, true],
                fillColor: "#f5f5f5",
                alignment: "right",
                margin: [0, 5, 0, 5],
              },
            ],
            [
              {
                text: "Cena s DPH",
                bold: true,
                fontSize: 20,
                alignment: "right",
                border: [false, false, false, true],
                margin: [0, 5, 0, 5],
              },
              {
                text: `${subtotalPrice * 1.25},-`,
                bold: true,
                fontSize: 20,
                alignment: "right",
                border: [false, false, false, true],
                fillColor: "#f5f5f5",
                margin: [0, 5, 0, 5],
              },
            ],
          ],
        },
      },
      // "\n\n",
      // {
      //   text: "Poznaámky",
      //   style: "notesTitle",
      // },
      // {
      //   text: "Some notes goes here \n Notes second line",
      //   style: "notesText",
      // },
    ],
    styles: {
      notesTitle: {
        fontSize: 10,
        bold: true,
        margin: [0, 50, 0, 3],
      },
      notesText: {
        fontSize: 10,
      },
    },
    defaultStyle: {
      columnGap: 20,
      // font: "Helvetica",
      //font: 'Quicksand',
    },
  }

};
