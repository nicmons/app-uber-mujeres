import { logout } from '@/core/services/login';
import useMainContext from '@/shared/Hooks/useMainContext';
import { ROUTE_IDS } from '@/utils/vars';
import { useRouteLoaderData, useNavigate } from 'react-router-dom';

const useMainLayout = () => {
  const { usuario } = useRouteLoaderData(ROUTE_IDS.USER);
  const { handleNotification } = useMainContext();
  const navigate = useNavigate();

  const handleMainLogout = async () => {
    try {
      const { message } = await logout(null);
      message && handleNotification(message);
      localStorage.clear();
    } catch (error) {
      handleNotification(error?.message, 'error');
    } finally {
      navigate('/');
    }
  };
  return { usuario, handleMainLogout };
};
export default useMainLayout;
