import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const downloadAsPDF = async ({
    selector = ".invoice-layout",
    filename = "document.pdf",
    scale = 2,
}) => {
    const element = document.querySelector(selector);
    if (!element) throw new Error(`Element not found: ${selector}`);

    const canvas = await html2canvas(element, {
        scale,
        useCORS: true,
        allowTaint: true,
        foreignObjectRendering: false,
        logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");

    const imgWidth = 210;                                         // A4 width in mm
    const pageHeight = 297;                                       // A4 height in mm

    // ✅ Calculate actual image height proportionally — don't force into one page
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    // ✅ First page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // ✅ Add new pages only for remaining content
    while (heightLeft > 0) {
        position -= pageHeight;                                     // shift image up
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
    }

    pdf.save(filename);
};