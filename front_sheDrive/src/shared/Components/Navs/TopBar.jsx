import { Toolbar, IconButton, Typography, AppBar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

function appBarLabel(label) {
  return (
    <Toolbar>
      <IconButton
        color="default"
        sx={{ mr: 2 }}
        disableTouchRipple
        disableRipple
        disableFocusRipple
      >
        <MenuIcon />
      </IconButton>
      <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
        {label}
      </Typography>
    </Toolbar>
  );
}
const TopBar = ({ title = '' }) => {
  return (
    <header>
      <AppBar position="static" color="default" enableColorOnDark>
        {appBarLabel(title)}
      </AppBar>
    </header>
  );
};

export default TopBar;
