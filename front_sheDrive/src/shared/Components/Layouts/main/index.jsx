import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SubMenuItemList from './SubmenuItems';
import MenuItemList from './MenuItemList';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import MenuIcon from '@mui/icons-material/Menu';
import NotificationsIcon from '@mui/icons-material/Notifications';
import LogoutIcon from '@mui/icons-material/Logout';
import { styled, useTheme } from '@mui/material/styles';
import {
  AppBar as MuiAppBar,
  Drawer as MuiDrawer,
  Box,
  Toolbar,
  List,
  CssBaseline,
  Typography,
  Divider,
  ListItem,
  IconButton,
  Badge,
  Tooltip,
  Popover,
  ListItemText,
} from '@mui/material';
import useMainLayout from './useMainLayout';
import FormCambiarPass from './CHANGEPASSWORD/FormCambiarPass';
import { getRouteId } from '@/utils/functions';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open && {
    ...openedMixin(theme),
    '& .MuiDrawer-paper': openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    '& .MuiDrawer-paper': closedMixin(theme),
  }),
}));

const notificaciones = [
  { name: 'notif1', mensage: 'Mensaje 1' },
  { name: 'notif2', mensage: 'Mensaje 2' },
  { name: 'notif3', mensage: 'Mensaje 3' },
];

export default function MainLayout({
  topBackGround = 'info',
  TopTitle,
  menuItems,
}) {
  // hooks
  const navigate = useNavigate();
  const theme = useTheme();
  const { usuario, handleMainLogout } = useMainLayout();
  // states
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleNotificationClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleNotificationClose = () => {
    setAnchorEl(null);
  };

  const openPopover = Boolean(anchorEl);
  const id = openPopover ? 'notification-popover' : undefined;

  // desnegar la condicion para mostrar el componente para cambiar contraseña
  if (usuario.cambiarContrasenna) return <FormCambiarPass />;
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed" open={open} color={topBackGround}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: 'none' }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{ cursor: 'pointer' }}
            onClick={() =>
              navigate(`/${getRouteId(location.pathname)}/dashboard`)
            }
          >
            {TopTitle}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              position: 'absolute',
              top: '0.8rem',
              right: 20,
              cursor: 'pointer',
              alignItems:'center',
            }}
          >
            <Badge
              color="error"
              variant="dot"
              invisible={notificaciones.length <= 0}
              overlap="circular"
            >
              <Tooltip title="Notificaciones">
                <IconButton color="inherit" onClick={handleNotificationClick}>
                  <NotificationsIcon />
                </IconButton>
              </Tooltip>
            </Badge>
            <Tooltip title="Cerrar sesión" onClick={() => handleMainLogout()}>
              <LogoutIcon sx={{ marginLeft: '1rem' }} />
            </Tooltip>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {menuItems?.map((elem) => (
            <ListItem key={elem.name} disablePadding sx={{ display: 'block' }}>
              {elem.to && !elem?.children ? (
                <MenuItemList
                  icon={elem.icon}
                  name={elem.name || ''}
                  to={elem.to}
                />
              ) : (
                <SubMenuItemList elem={elem} highOpened={open} />
              )}
            </ListItem>
          ))}
        </List>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <DrawerHeader />
        <Outlet />
      </Box>
      <Popover
        id={id}
        open={openPopover}
        anchorEl={anchorEl}
        onClose={handleNotificationClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        <List sx={{ width: '300px', maxHeight: '400px', overflow: 'auto' }}>
          {notificaciones.length > 0 ? (
            notificaciones.map((notif, index) => (
              <Box key={index}>
                <ListItem button>
                  <ListItemText
                    primary={notif.name}
                    secondary={notif.mensage}
                  />
                </ListItem>
                {index < notificaciones.length - 1 && <Divider />}
              </Box>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No hay notificaciones" />
            </ListItem>
          )}
        </List>
      </Popover>
    </Box>
  );
}
