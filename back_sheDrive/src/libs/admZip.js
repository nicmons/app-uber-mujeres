const AdmZip = require("adm-zip");

/**
 * Este código define una función llamada compressToZip que comprime una carpeta en un archivo zip usando la librería adm-zip.
 * @param {*} filePath  (string): La ruta a la carpeta que necesita ser comprimida.
 * @param {*} outputPath (string): La ruta al archivo zip de salida.
 */
exports.compressToZip = async (filePath, outputPath) => {
  try {
    const zip = new AdmZip();
    zip.addLocalFile(filePath);
    zip.writeZip(outputPath);
    return true;
  } catch (error) {
    return false;
  }
};
