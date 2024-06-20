const ReporteNovedad = require("#M/reporteNovedad.model");
const { uploadMiddleware } = require("#SRC/libs/uploads");

const validationsAdjuntoNovedad = async (req, cb) => {
  const { id_reporteNovedad } = req.body;
  if (!id_reporteNovedad)
    return cb(new Error("id reporte novedad es requerido"));

  const exist = await ReporteNovedad.findByPk(id_reporteNovedad);
  if (!exist) return cb(new Error("No existe reporte novedad"));

  cb(null, true);
};

exports.validate_create_file_reporteNovedad = [
  uploadMiddleware({
    field: "adjunto_novedad",
    folderName: "FILES_REP_NOVEDAD",
    maxSize: 15,
    extensions: [".jpg", ".jpeg", ".png", ".pdf", ".xlsx", ".xltx"],
    bodyValitations: validationsAdjuntoNovedad,
  }),
];
