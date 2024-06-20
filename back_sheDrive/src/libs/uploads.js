const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { MB_FACTOR } = require("#H/utils");
const { httpError } = require("#H/httpResponses");
const { fileValidations } = require("#H/functions");

exports.createCarpeta = (ruta) => {
  if (!fs.existsSync(ruta)) {
    fs.mkdirSync(ruta);
    console.log(`Se creó la carpeta: ${ruta}`);
  }
};

const configureStorage = (folderName) =>
  multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, `../${folderName}`);
    },
  });

/**
 * Esta función crea un middleware de subida de archivos utilizando el paquete `multer`.
 * El middleware de subida de archivos se utiliza para subir archivos al servidor.
 * @param {Object} options - Opciones para configurar el middleware de subida de archivos.
 * @param {string} options.field - El nombre del campo de la solicitud que contiene el archivo.
 * @param {string} options.folderName - El nombre de la carpeta donde se guardarán los archivos.
 * @param {string[]} [options.extensions] - Las extensiones de archivo permitidas.
 * @param {number} [options.maxSize] - El tamaño máximo del archivo en MB.
 * @param {Object[]} [options.bodyValitations] - Las validaciones de los campos de la solicitud.
 * @returns {Function} - El middleware de subida de archivos.
 * @throws {Error} - Si se produce un error al configurar el middleware de subida de archivos.
 */
exports.uploadMiddleware = ({
  field,
  folderName,
  extensions = undefined,
  maxSize = undefined,
  bodyValitations = undefined,
}) => {
  const upload = multer({
    storage: configureStorage(folderName),
    limits: {
      fileSize: maxSize * MB_FACTOR,
    },
    fileFilter: (req, file, cb) => {
      this.createCarpeta(path.join("..", folderName));
      return fileValidations({
        field,
        extensions,
        file,
        cb: cb,
        req,
        bodyValitations,
      });
    },
  });
  const singleFileUpload = upload.single(field);

  return (req, res, next) => {
    singleFileUpload(req, res, (err) => {
      if (err) {
        console.log("error file upload", err.message);
        return httpError(
          res,
          err?.code === "LIMIT_FILE_SIZE"
            ? `El archivo excede ellimite de ${maxSize}MB permitidos`
            : err.message
        );
      }
      next();
    });
  };
};
