import { getAdjuntoNovedad } from '@/core/services';
import useMainContext from '@/shared/Hooks/useMainContext.jsx';
import { ROUTE_IDS } from '@/utils/vars/index.jsx';
import { useMemo, useState } from 'react';
import { useRouteLoaderData } from 'react-router-dom';
import { saveAs } from 'file-saver';

const useDetalleForm = () => {
  const { colors, handleNotification } = useMainContext();
  const { motivosList } = useRouteLoaderData(ROUTE_IDS.RH_NOVEDADES);
  const [modalShow, setModalShow] = useState(null);
  const [dataModals, setDataModals] = useState({
    reversar: null,
  });
  const listaMotivos = useMemo(
    () =>
      motivosList?.map((motivo) => ({
        value: motivo.idMotivo,
        label: motivo.nombre,
      })),
    [motivosList]
  );

  const handleDetalle = (modalType, data = null) => {
    setDataModals((prev) => ({ ...prev, [modalType]: data }));
    setModalShow(!data ? null : modalType);
  };

  const handleGetAdjunto = async (file) => {
    try {
      const { idAdjuntoNovedad, nombreFile, extension } = file;
      const respBlobFile = await getAdjuntoNovedad(idAdjuntoNovedad);
      saveAs(new Blob([respBlobFile]), `${nombreFile}${extension}`);
    } catch (error) {
      handleNotification('Error al descargar el archivo', 'error');
    }
  };

  return {
    modalShow,
    dataModals,
    colors,
    listaMotivos,
    handleDetalle,
    handleGetAdjunto,
  };
};

export default useDetalleForm;
