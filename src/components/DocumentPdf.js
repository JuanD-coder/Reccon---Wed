import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { ref, uploadBytes } from "firebase/storage";
import { storege } from "../firebase/firebaseConfig";
import { getActivesPrices, userID } from '../pages/home/user-home';
import { lotes, recolectores } from './getUserData';

pdfMake.vfs = pdfFonts.pdfMake.vfs

const getPrices = await getActivesPrices()
let totalKg = 0
let totalPay = 0

const docDefinition = {
  info: {
    title: `Informe {tipoInfome} ${date()}`
  },
  content: [
    /* Encabezado */
    {
      image: await getImageBase64('../../assets/images/header.png'),
      width: 600,
      height: 230,
      absolutePosition: { x: -1, y: -1 },
    },
    {
      alignment: 'justify',
      columns: [
        {
          width: 320,
          fontSize: 33,
          color: '#fdfdfd',
          text: 'Informes Mensuales \n de Recoleccion',
          margin: [0, 30, 0, 0],
          style: 'header',
        },
        {
          width: 300,
          alignment: 'left',
          image: await getImageBase64('../../assets/images/logo/reccon_pdf_white.png'),
          fit: [250, 200],
          margin: [0, -35, 0, 0],
        }
      ],
    },
    /* Precios */
    {
      text: 'Precios Vigentes: ',
      color: 'black',
      margin: [15, 5, 0, 0],
      style: 'textBold'
    },
    {
      style: 'tableExample',
      table: {
        headerRows: 1,
        body: [
          [{ text: 'Alimentación:', style: 'tableHeader' }, { text: `$${getPrices.activePriceData.yesAliment}`, style: 'tableBody' }],
          [{ text: 'Sin Alimentación:', style: 'tableHeader' }, { text: `$${getPrices.activePriceData.notAliment}`, style: 'tableBody' }],
        ]
      },
      layout: 'headerLineOnly'
    },
    {
      style: 'tableExample',
      table: {
        widths: [165, 80],
        body: [
          [{ text: 'Precios Anteriores', colSpan: 2, style: 'tableReportHeader', fontSize: 15 }, {}],
          ...getPrices.priceData.map((element) => {
            if (element.alimentacion === 'yes') return [{ text: 'Con Alimentacion:', fontSize: 15 }, { text: `$${element.price}`, style: 'tableBody' }];
            if (element.alimentacion === 'no') return [{ text: 'Sin Alimentacion:', fontSize: 15 }, { text: `$${element.price}`, style: 'tableBody' }];
            return ["No hay precios establecidos anteriormente"];
          })
        ]
      },
      layout: {
        fillColor: function (rowIndex, node, columnIndex) {
          return (rowIndex % 2 === 0) ? '#cff8c8' : null;
        }
      }
    },
    /* Resumen de la Recoleccion */
    {
      margin: [15, 5, 0, 0],
      bold: true,
      fontSize: 18,
      color: 'black',
      text: 'Resumen ${Tipo de Informe} de la Recolección del Café:',
    },
    {
      /* Tabla del Resumen */
      style: 'tableExample',
      table: {
        widths: ['auto', 'auto', 'auto', 'auto', 'auto'],
        body: await tableDetail(),
      },
      layout: {
        hLineWidth: function (i, node) {
          return (i === 0 || i === node.table.body.length) ? 2 : 1;
        },
        vLineWidth: function (i, node) {
          return (i === 0 || i === node.table.widths.length) ? 2 : 1;
        },
        hLineColor: function (i, node) {
          return 'black';
        },
        vLineColor: function (i, node) {
          return 'black';
        },
        hLineStyle: function (i, node) {
          if (i === 0 || i === node.table.body.length) {
            return null;
          }
          return { dash: { length: 10, space: 4 } };
        },
        vLineStyle: function (i, node) {
          if (i === 0 || i === node.table.widths.length) {
            return null;
          }
          return { dash: { length: 4 } };
        },
      }
    },
    {

      style: 'tableExample',
      alignment: 'justify',
      columns: [
        {
          with: 500,
          text: " ",
          alignment: "right"
        },
        {
          with: 500,
          text: " ",
          alignment: "right"
        },
        {
          with: 500,
          text: "Total: ",
          alignment: 'right',
          fontSize: 18,
        },
        {
          with: 5,
          text: `${totalKg} Kg`,
          alignment: 'right',
          fontSize: 18,
        },
        {
          with: 5,
          text: `$ ${totalPay}`,
          alignment: 'right',
          fontSize: 18,
        }
      ],
    },
    /* Pie de Pagina */
    {
      margin: [0, 100, 0, 0],
      columns: [
        {
          width: "*",
          text: "Con cada semana de recolección, avanzamos hacia la \n excelencia en nuestra producción cafetera. \n ¡Sigamos cosechando éxitos juntos!",
          alignment: 'left',
          fontSize: 13,
          bold: true
        },
        {
          width: 100,
          image: await getImageBase64('../../assets/images/icons/granja.png'),
          alignment: 'right'
        }
      ]
    }
  ],
  styles: {
    header: {
      fontSize: 18,
      bold: true,
      alignment: 'center'
    },
    textBold: {
      fontSize: 23,
      bold: true,
    },
    tableExample: {
      margin: [15, 10, 0, 15]
    },
    tableHeader: {
      bold: true,
      fontSize: 18,
      color: 'black',
    },
    tableBody: {
      alignment: 'center',
      fontSize: 18,
    },
    tableReportHeader: {
      alignment: 'center',
      fillColor: '#4a943e',
      color: 'white',
      bold: true,
    }
  }
};

function date() {
  const currentDate = new Date();

  const pad2 = (num) => num.toString().padStart(2, '0');
  const month = currentDate.getMonth();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const fechaFormateada = `${pad2(month + 1)}-${day}-${currentDate.getFullYear()}`;

  return fechaFormateada
}

export let pdfDocGenerator = pdfMake.createPdf(docDefinition)
export async function createPdfInforme() {
  return new Promise((resolve, reject) => {
    pdfDocGenerator.getBlob(async function (blob) {
      try {
        let storageRef = ref(storege, `${userID}/Informes/Informe-{tipoInfome}-${date()}`)
        await uploadBytes(storageRef, blob);

        resolve(blob)
      } catch (error) {
        console.error('Error al subir el archivo:', error);
        reject(error)
      }
    });
  })

}

async function getImageBase64(imageUrl) {
  return new Promise((resolve, reject) => {
    const cachedImage = sessionStorage.getItem(imageUrl);

    if (cachedImage) {
      resolve(cachedImage);
      return;
    }

    var img = new Image();
    img.crossOrigin = 'Anonymous';
    img.src = imageUrl;

    img.onload = function () {
      var canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;

      var ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0);

      var base64Image = canvas.toDataURL('image/png', 0.8);
      sessionStorage.setItem(imageUrl, base64Image);

      resolve(base64Image);
    };

    img.onerror = function () {
      reject(new Error('Error al cargar la imagen'));
    };
  });
}

async function tableDetail() {
  const recolectorInfo = new recolectores(userID);
  const lotesInfo = new lotes(userID);

  const getNameRecolectors = await recolectorInfo.getRecolectores();
  const columnTable = [
    [
      { text: 'Nombre del Recolector', style: 'tableReportHeader', fontSize: 15 },
      { text: 'Fecha Recolectado', style: 'tableReportHeader', fontSize: 15 },
      { text: 'Lote Recolectado', style: 'tableReportHeader', fontSize: 15 },
      { text: 'Total Recolectado', style: 'tableReportHeader', fontSize: 15 },
      { text: 'Total Pagado', style: 'tableReportHeader', fontSize: 15 }
    ],
  ];

  for (const recolectorDoc of getNameRecolectors.docs) {
    const dataRecolector = recolectorDoc.data();
    const recolectorName = dataRecolector.recolector_name;
    const recolectorId = recolectorDoc.id;

    const getRecolecion = await recolectorInfo.getHarverst(recolectorId);
    const recolecciones = getRecolecion.recolecciones.docs;

    const uniqueLotes = new Set();
    const lotesArray = [];

    for (const recoleccionDoc of recolecciones) {
      const recoleccionData = recoleccionDoc.data();
      const loteId = recoleccionData.lote_id;

      if (!uniqueLotes.has(loteId)) {
        uniqueLotes.add(loteId);
        let loteName = await lotesInfo.getNameLote(loteId);
        lotesArray.push(loteName);
      }
    }

    const rowSpan = lotesArray.length;

    totalKg += getRecolecion.totalKg
    totalPay += getRecolecion.totalPay

    lotesArray.forEach((loteName, index) => {
      columnTable.push([
        { rowSpan: index === 0 ? rowSpan : 0, text: index === 0 ? recolectorName : '', style: 'tableReportHeader', fontSize: 15 },
        { rowSpan: index === 0 ? rowSpan : 0, text: '', style: 'tableBody', fontSize: 15 },
        { text: loteName, style: 'tableBody', fontSize: 15 },
        { rowSpan: index === 0 ? rowSpan : 0, text: `${getRecolecion.totalKg} Kg`, style: 'tableBody', fontSize: 15 },
        { rowSpan: index === 0 ? rowSpan : 0, text: `$${getRecolecion.totalPay}`, style: 'tableBody', fontSize: 15 }
      ]);
    });
  }

  return columnTable;
}

