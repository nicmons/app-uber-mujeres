import { useEffect, useRef, useState } from 'react';
import {
  Box,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  Tooltip,
  Typography,
} from '@mui/material';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import { useFormikContext } from 'formik';

function FileUpload({ maxFiles = 3, name }) {
  const [files, setFiles] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const fileInputRef = useRef(null);

  const { setFieldValue } = useFormikContext();
  const handleDragOver = (event) => {
    event.preventDefault();
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragEnter = (event) => {
    event.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragOver(false);
    processFiles(event.dataTransfer.files);
  };

  const handleFileSelect = (event) => {
    processFiles(event.target.files);
  };

  const processFiles = (fileList) => {
    const newFiles = Array.from(fileList).map((file) => {
      let preview = '';
      if (file.type.startsWith('image/')) {
        preview = URL.createObjectURL(file);
      } else if (file.type === 'application/pdf') {
        preview = URL.createObjectURL(file); // O puedes usar un icono estático si prefieres
      } else if (
        [
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/msword',
        ].includes(file.type)
      ) {
        preview = 'word-icon.png'; // Reemplazar con el path a un icono de Word
      } else {
        preview = 'generic-file-icon.png'; // Reemplazar con un icono genérico para otros tipos de archivos
      }

      return Object.assign(file, { preview });
    });
    if (files.length + newFiles.length > maxFiles)
      return setErrorMessage(`No puedes subir más de ${maxFiles} archivos.`);

    setErrorMessage('');
    setFiles((currentFiles) => [...currentFiles, ...newFiles]);
  };

  const removeFile = (fileName) => {
    setFiles((currentFiles) =>
      currentFiles.filter((file) => file.name !== fileName)
    );
    files.forEach((file) => {
      if (file.name === fileName) {
        URL.revokeObjectURL(file.preview);
      }
    });
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };
  const dropzoneStyle = {
    border: isDragOver ? '1px dashed blue' : '1px dashed gray',
    padding: '20px',
    textAlign: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease-out',
    boxShadow: isDragOver ? '0 2px 10px #c0c0c0e3' : '',
    transform: isDragOver ? 'scale(1.05)' : 'scale(1)',
  };

  useEffect(() => {
    setFieldValue(name, files);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [files, name]);

  return (
    <Box>
      <div
        onDragOver={handleDragOver}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
        style={dropzoneStyle}
      >
        <Typography>
          Arrastra y suelta los archivos aquí, o haz clic para seleccionar
        </Typography>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
          id="file-upload"
        />
      </div>
      {errorMessage && (
        <Typography color="error" style={{ marginTop: '10px' }}>
          {errorMessage}
        </Typography>
      )}
      <aside>
        <List>
          <ListItem disablePadding sx={{ p: 0 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', padding: 1 }}>
              {files?.map((file) => (
                <ListItemButton
                  key={file.name}
                  sx={{ padding: 2 }}
                  onClick={() => removeFile(file.name)}
                >
                  {file.type.startsWith('image/') && (
                    <img
                      src={file.preview}
                      style={{ width: '100px', height: '60px' }}
                      alt="preview"
                    />
                  )}
                  {file.type === 'application/pdf' && (
                    <object
                      data={file.preview}
                      type="application/pdf"
                      width="100px"
                      height="60px"
                      style={{ overflow: 'hidden' }}
                    ></object>
                  )}
                  {[
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/msword',
                  ].includes(file.type) && (
                    <img
                      src={file.preview}
                      style={{ width: '100px' }}
                      alt="documento word"
                    />
                  )}
                  {![
                    'image/',
                    'application/pdf',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                    'application/msword',
                  ].some((type) => file.type.startsWith(type)) && (
                    <img
                      src={file.preview}
                      style={{ width: '100px' }}
                      alt="File icon"
                    />
                  )}
                  <Tooltip title="Remover">
                    <IconButton onClick={() => removeFile(file.name)}>
                      <RemoveCircleOutlineIcon color="error" />
                    </IconButton>
                  </Tooltip>
                </ListItemButton>
              ))}
            </Box>
          </ListItem>
        </List>
      </aside>
    </Box>
  );
}

export default FileUpload;
