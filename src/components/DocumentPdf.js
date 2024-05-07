import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from "pdfmake/build/vfs_fonts";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storege } from "../firebase/firebaseConfig";
import { getActivesPrices, userID } from '../pages/home/user-home';
import { lotes, Recolectores } from './getUserData';

pdfMake.vfs = pdfFonts.pdfMake.vfs

const recolectorInfo = new Recolectores(userID);
const getPrices = await getActivesPrices()
let typePdf
let totalKg = 0
let totalPay = 0

function date() {
  const currentDate = new Date();

  const pad2 = (num) => num.toString().padStart(2, '0');
  const month = currentDate.getMonth();
  const day = String(currentDate.getDate()).padStart(2, '0');
  const fechaFormateada = `${pad2(month + 1)}-${day}-${currentDate.getFullYear()}`;

  return fechaFormateada
}

async function informe() {
  const docDefinition = {
    info: {
      title: `${typePdf} ${date()}`
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
            text: `${typePdf} \n de Recoleccion`,
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
        text: `Resumen del ${typePdf} de la Recolección del Café:`,
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

  return docDefinition
}

export async function createPdfInforme(type) {
  return new Promise(async (resolve, reject) => {
    typePdf = type;
    const pdf = await informe()
    let pdfDocGenerator = pdfMake.createPdf(pdf)

    pdfDocGenerator.getBlob(async function (blob) {
      try {
        let storageRef = ref(storege, `${userID}/Informes/${type} ${date()}`)
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef)

        resolve(downloadURL)
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
  const lotesInfo = new lotes(userID);
  const docsHarvest = await typeInforme(typePdf);

  // Función para contar las ocurrencias de cada recolector
  const countRecolectorOccurrences = (docsHarvest) => {
    const occurrences = {};
    for (const recolectorDoc of docsHarvest) {
      occurrences[recolectorDoc.recolector_name] = (occurrences[recolectorDoc.recolector_name] || 0) + 1;
    }
    return occurrences;
  };

  // Función para construir la tabla
  const buildTable = async (docsHarvest, recolectorOccurrences) => {
    const columnTable = [
      [
        { text: 'Nombre del Recolector', style: 'tableReportHeader', fontSize: 15 },
        { text: 'Fecha Recolectado', style: 'tableReportHeader', fontSize: 15 },
        { text: 'Lote Recolectado', style: 'tableReportHeader', fontSize: 15 },
        { text: 'Total Recolectado', style: 'tableReportHeader', fontSize: 15 },
        { text: 'Total Pagado', style: 'tableReportHeader', fontSize: 15 }
      ],
    ];

    for (const recolectorDoc of docsHarvest) {
      const recolectorName = recolectorDoc.recolector_name;
      const loteId = recolectorDoc.recoleccion.lote_id;
      const loteName = await lotesInfo.getNameLote(loteId);
      const totalOccurrences = recolectorOccurrences[recolectorName];

      totalKg += recolectorDoc.recoleccion_total;
      totalPay += recolectorDoc.recoleccion_pay;

      columnTable.push([
        { rowSpan: totalOccurrences, text: recolectorName, style: 'tableReportHeader', fontSize: 15 },
        { rowSpan: totalOccurrences, text: '', style: 'tableBody', fontSize: 15 },
        { text: loteName, style: 'tableBody', fontSize: 15 },
        { text: `${recolectorDoc.recoleccion_total} Kg`, style: 'tableBody', fontSize: 15 },
        { text: `$${recolectorDoc.recoleccion_pay}`, style: 'tableBody', fontSize: 15 }
      ]);

      // Reducir el número de ocurrencias para evitar repeticiones innecesarias
      recolectorOccurrences[recolectorName] = 0;
    }

    if (columnTable.length <= 1) {
      columnTable.push([
        { colSpan: 5, border: [false, false, false, false], text: "No se registraron recoleciones para este informe", style: 'tableBody', fontSize: 20 },
      ])
    }

    return columnTable;
  };

  const recolectorOccurrences = countRecolectorOccurrences(docsHarvest);
  const table = await buildTable(docsHarvest, recolectorOccurrences);

  return table;
}

async function typeInforme(type) {
  const currentDate = new Date()
  console.log(type)

  switch (type) {
    case "Informe Semenal":
      const weekDays = getWeekDays(currentDate)
      return await recolectorInfo.getHarverstDateWeek(weekDays)

    case "Informe Mensual":
      const month = currentDate.toLocaleDateString('es-ES', { month: 'long' });
      return await recolectorInfo.getHarverstDateMonth(month, currentDate.getFullYear())

    case "Informe Anual":
      return await recolectorInfo.getHarverstDateYear(currentDate.getFullYear())

    default:
      console.log("Tipo de informe no especificado.");
      return null;
  }
}

function getWeekDays(currentDate) {
  const firstDayWeek = new Date(currentDate);
  const weekDays = [];

  firstDayWeek.setDate(currentDate.getDate() - (currentDate.getDay() === 0 ? 6 : currentDate.getDay() - 1));

  for (let i = 0; i < 7; i++) {
    const day = new Date(firstDayWeek);
    day.setDate(firstDayWeek.getDate() + i);
    const components = day.toLocaleDateString('es-ES', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }).split(' ');
    const formatDate = `${components[0].replace(",", "")} ${components[3]} ${components[1]} del ${components[5]}`;
    weekDays.push(formatDate);
  }
  return weekDays;
}

