import { NavLink } from 'react-router-dom';
import {
  Tooltip,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import useMainContext from '@/shared/Hooks/useMainContext';

const MenuItemList = ({ to, icon, name }) => {
  const { colors } = useMainContext();
  return (
    <NavLink to={to}>
      {({ isActive }) => {
        return (
          <Tooltip placement="right-start" title={name}>
            <ListItemButton
              sx={{
                minHeight: 48,
                px: 2.5,
              }}
            >
              <ListItemIcon
                sx={{
                  color: isActive ? colors?.HxPrimary : 'none',
                  minWidth: 0,
                  mr: open ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText
                primary={name}
                sx={{ color: isActive ? colors?.HxPrimary : 'black' }}
              />
            </ListItemButton>
          </Tooltip>
        );
      }}
    </NavLink>
  );
};

export default MenuItemList;
