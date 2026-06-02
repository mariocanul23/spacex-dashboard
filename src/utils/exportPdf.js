import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const loadImageAsBase64 = (url) => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.crossOrigin = "anonymous";

    image.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = image.width;
      canvas.height = image.height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(image, 0, 0);

      const dataUrl = canvas.toDataURL("image/png");
      resolve(dataUrl);
    };

    image.onerror = reject;
    image.src = url;
  });
};

export const exportLaunchToPdf = async ({ launch, launchpad }) => {
  const doc = new jsPDF();

  const status =
    launch.success === null ? "Pendiente" : launch.success ? "Exitoso" : "Fallido";

  const imageUrl = launch.links?.patch?.large || launch.links?.patch?.small;
  let imageLoaded = false;

  doc.setFontSize(18);
  doc.text("Reporte de lanzamiento SpaceX", 14, 20);

  if (imageUrl) {
    try {
      const image = await loadImageAsBase64(imageUrl);
      doc.addImage(image, "PNG", 150, 12, 35, 35);
      imageLoaded = true;
    } catch (error) {
      console.log("No se pudo cargar la imagen para el PDF", error);
    }
  }

  doc.setFontSize(12);
  doc.text("Resumen del lanzamiento seleccionado", 14, 35);

  autoTable(doc, {
    startY: 42,
    head: [["Campo", "Valor"]],
    body: [
      ["Nombre", launch.name],
      ["Fecha", new Date(launch.date_utc).toLocaleString("es-MX")],
      ["Estado", status],
      ["Número de vuelo", launch.flight_number],
      ["Ubicación", launchpad?.full_name || "Sin ubicación"],
      ["Localidad", launchpad?.locality || "Sin localidad"],
      ["Región", launchpad?.region || "Sin región"],
      ["Latitud", launchpad?.latitude || "Sin latitud"],
      ["Longitud", launchpad?.longitude || "Sin longitud"],
      ["Imagen", imageUrl || "Sin imagen"],
    ],
  });

  let finalY = doc.lastAutoTable.finalY + 10;

  if (imageUrl && !imageLoaded) {
    doc.setFontSize(10);
    doc.text(
      "Nota: La imagen no pudo incrustarse por restricciones CORS. Se incluye la URL en la tabla.",
      14,
      finalY
    );

    finalY += 10;
  }

  doc.setFontSize(12);
  doc.text("Detalle", 14, finalY);

  const details = launch.details || "Sin detalles disponibles";
  const splitDetails = doc.splitTextToSize(details, 180);

  doc.text(splitDetails, 14, finalY + 8);

  doc.save(`lanzamiento-${launch.name}.pdf`);
};

export const exportMultipleLaunchesToPdf = ({ launches, launchpads }) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text("Reporte de lanzamientos SpaceX", 14, 20);

  doc.setFontSize(12);
  doc.text(`Total de registros exportados: ${launches.length}`, 14, 32);

  autoTable(doc, {
    startY: 42,
    head: [["Nombre", "Fecha", "Estado", "Ubicación", "Imagen"]],
    body: launches.map((launch) => {
      const launchpad = launchpads.find(
        (item) => item.id === launch.launchpad
      );

      const status =
        launch.success === null
          ? "Pendiente"
          : launch.success
          ? "Exitoso"
          : "Fallido";

      return [
        launch.name,
        new Date(launch.date_utc).toLocaleString("es-MX"),
        status,
        launchpad?.full_name || "Sin ubicación",
        launch.links?.patch?.large || "Sin imagen",
      ];
    }),
  });

  let finalY = doc.lastAutoTable.finalY + 10;

  doc.setFontSize(14);
  doc.text("Detalle de registros seleccionados", 14, finalY);

  launches.forEach((launch, index) => {
    const launchpad = launchpads.find((item) => item.id === launch.launchpad);

    const status =
      launch.success === null
        ? "Pendiente"
        : launch.success
        ? "Exitoso"
        : "Fallido";

    finalY += 12;

    if (finalY > 260) {
      doc.addPage();
      finalY = 20;
    }

    doc.setFontSize(12);
    doc.text(`${index + 1}. ${launch.name}`, 14, finalY);

    const details = [
      `Fecha: ${new Date(launch.date_utc).toLocaleString("es-MX")}`,
      `Estado: ${status}`,
      `Número de vuelo: ${launch.flight_number}`,
      `Ubicación: ${launchpad?.full_name || "Sin ubicación"}`,
      `Coordenadas: ${launchpad?.latitude || "N/A"}, ${
        launchpad?.longitude || "N/A"
      }`,
      `Imagen: ${launch.links?.patch?.large || "Sin imagen"}`,
      `Detalles: ${launch.details || "Sin detalles disponibles"}`,
    ];

    const text = doc.splitTextToSize(details.join("\n"), 180);
    doc.text(text, 14, finalY + 8);

    finalY += text.length * 6 + 10;
  });

  doc.save("lanzamientos-seleccionados.pdf");
};