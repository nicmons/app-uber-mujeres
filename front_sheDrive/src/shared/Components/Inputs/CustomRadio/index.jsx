import { Radio, FormControlLabel } from '@mui/material';

const CustomRadio = ({ idEmpresa, strCode, selectedValue, onChange }) => {
  return (
    <FormControlLabel
      value={idEmpresa}
      control={<Radio />}
      label={strCode}
      checked={selectedValue === idEmpresa}
      onChange={onChange}
    />
  );
};

export default CustomRadio;
