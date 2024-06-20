import { IconButton } from '@mui/material';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
const CheckBoxComponent = ({ checked, handleOnChange, color }) => {
  return (
    <IconButton onClick={() => handleOnChange(!checked)} color={color}>
      {!checked ? <CheckBoxOutlineBlankIcon /> : <CheckBoxIcon />}
    </IconButton>
  );
};

export default CheckBoxComponent;
