import { getRouteId } from '@/utils/functions';
import { useLocation, useRouteLoaderData } from 'react-router-dom';
import ReportGmailerrorredIcon from '@mui/icons-material/ReportGmailerrorred';
import CheckIcon from '@mui/icons-material/Check';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

/**  Funcion para calcular el ancho de cada columna para hacer mas legible el excelll */
const calculateColumnWidths = (data, headers) => {
  const widths = headers.map((header) => ({ wch: header.length }));
  data.forEach((row) => {
    headers.forEach((header, index) => {
      const value = row[header];
      if (value && value.toString().length > widths[index].wch) {
        widths[index].wch = value.toString().length;
      }
    });
  });
  return widths;
};
const useMainContext = () => {
  const location = useLocation();
  const { colors } = useRouteLoaderData(getRouteId(location.pathname));

  /**
   * @param {string} message
   * @param {"success"|"error"|"warning"} type - Un número cualquiera.
   * @param {string} colorr ej: "#ffffff"
   */
  const handleNotification = (message, type = 'success', colorr) => {
    switch (type) {
      case 'success':
        return toast.success(message, {
          progressStyle: {
            color: colorr ?? colors?.HxPrimary,
            background: colorr ?? colors?.HxPrimary,
          },
          style: { color: colorr ?? colors?.HxPrimary },
          icon: <CheckIcon sx={{ color: colorr ?? colors?.HxPrimary }} />,
        });
      case 'error':
        return toast.error(message, {
          progressStyle: {
            color: colorr ?? 'red',
            background: colorr ?? 'red',
          },
          style: { color: colorr ?? 'red' },
          icon: <ReportGmailerrorredIcon sx={{ color: colorr ?? 'red' }} />,
        });
      default:
        return toast[type](message);
    }
  };
  /**
   *
   * @param {Array} data data equivale a un array segun la data con la que se quiera formar el archivo excell
   * @param {string} nameFile el nombre del arvhivo a descargar
   * @param {string} hojaName el nombre de la hoja
   * @param {string[]} headers headers establece el orden en que se desee alterar las columnas del excell
   */
  const handleDownloadXlsx = (
    originalData,
    nameFile,
    hojaName = 'Records',
    headers = []
  ) => {
    const data = originalData.map((item) => {
      const transformedItem = {};
      for (const key in item) {
        transformedItem[key] =
          typeof item[key] === 'string' ? item[key].toUpperCase() : item[key];
      }
      return transformedItem;
    });

    const worksheet = XLSX.utils.json_to_sheet(data, {
      header: headers,
      origin: 1,
    });

    /** Establecer el ancho de las columnas */
    const columnWidths = calculateColumnWidths(data, headers);
    worksheet['!cols'] = columnWidths;
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, hojaName);

    const blob = new Blob(
      [XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })],
      {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      }
    );
    saveAs(blob, `${nameFile}.xlsx`);
  };

  return {
    handleNotification,
    handleDownloadXlsx,
    colors,
  };
};

export default useMainContext;
