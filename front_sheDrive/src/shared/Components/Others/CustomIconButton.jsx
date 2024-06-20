import { CircularProgress, IconButton } from '@mui/material';
import { useState } from 'react';

const CustomIconButton = ({ icon: Icon, color, onClick, ...props }) => {
  const [loading, setLoading] = useState(false);
  return (
    <>
      {!loading ? (
        <IconButton
          sx={{ p: 0 }}
          onClick={async () => {
            setLoading((prev) => !prev);
            await onClick();
            setLoading((prev) => !prev);
          }}
          disabled={loading}
          {...props}
        >
          <Icon color={props.disabled ? '' : color} />
        </IconButton>
      ) : (
        <CircularProgress size={15} />
      )}
    </>
  );
};
export default CustomIconButton;
