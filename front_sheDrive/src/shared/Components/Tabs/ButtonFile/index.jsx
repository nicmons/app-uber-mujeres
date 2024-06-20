import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import VisibilityIcon from '@mui/icons-material/Visibility';

const ButtonFile = ({ file, color, onClick }) => {
  const [load, setLoad] = useState(false);
  return (
    <LoadingButton
      loadingPosition="end"
      variant="text"
      color={color}
      loading={load}
      startIcon={<VisibilityIcon />}
      onClick={async () => {
        setLoad(true);
        await onClick(file);
        setLoad(false);
      }}
    >
      {file.nombreOriginal}
    </LoadingButton>
  );
};

export default ButtonFile;
