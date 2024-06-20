import DashBoard from '@/shared/Components/Dashboard';
import MainLayout from '@/shared/Components/Layouts/main';
import Usuario from '@/Pages/Administracion/Configuracion/Usuario';
import RedirectPage from '@/utils/RedirectPage';
import { ROUTE_IDS } from '@/utils/vars';
import SettingsIcon from '@mui/icons-material/Settings';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import SystemSecurityUpdateGoodIcon from '@mui/icons-material/SystemSecurityUpdateGood';
import { purple, indigo } from '@mui/material/colors';
import { Outlet, json } from 'react-router-dom';
import AprovacionContraseña from '@/Pages/Administracion/Configuracion/Habilitacion';

import { loader as loaderConfiguracionUsu } from '@/Pages/Administracion/Configuracion/Usuario/index';
import { getUsuarios } from '@/core/services/administrador';

const menuItemsAdmin = [
  {
    name: 'configuracion',
    to: '',
    icon: <SettingsIcon />,
    children: [
      {
        name: 'usuarios',
        to: '/admin/configuracion/usuarios',
        icon: <SupervisedUserCircleIcon />,
      },
      {
        name: 'habilitacion de contraseña',
        to: '/admin/configuracion/habilitacion',
        icon: <SystemSecurityUpdateGoodIcon />,
      },
    ],
  },
];
const loader = async () => {
  const colors = {
    primary: 'primary',
    HxPrimary: purple[800],
    secondary: 'secondary',
    Hsecondary: indigo[500],
  };
  return json({ colors });
};
const loaderConfiguracionUsuarios = async () => {
  const [{ records: usuarios }] = await Promise.all([getUsuarios()]);
  return json({ usuarios });
};

const adminRoutes = [
  {
    id: ROUTE_IDS.ADMIN,
    loader: loader,
    path: 'admin',
    element: (
      <MainLayout
        TopTitle={'Administración'}
        topBackGround="primary"
        menuItems={menuItemsAdmin}
      />
    ),
    children: [
      {
        index: true,
        element: <RedirectPage url={'/admin/dashboard'} />,
      },
      {
        path: 'dashboard',
        element: <DashBoard tittle="Admin DashBoard" />,
      },
      {
        id: ROUTE_IDS.ADMIN_USUARIOS,
        path: 'configuracion',
        element: <Outlet />,
        loader: loaderConfiguracionUsuarios,
        children: [
          {
            index: true,
            element: <RedirectPage url={'/admin/configuracion/usuarios'} />,
          },
          {
            path: 'usuarios',
            loader: loaderConfiguracionUsu,
            element: <Usuario />,
          },
          {
            path: 'habilitacion',
            element: <AprovacionContraseña />,
          },
        ],
      },
    ],
  },
];

export default adminRoutes;
