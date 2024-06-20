import { v4 as uuidv4 } from 'uuid';
import {
  TextField,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  TablePagination,
  Button,
  Tooltip,
  Paper,
  Grid,
} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import useTableAccion from './useTableAccion';
import { findPrimaryKeyValue, setColorsMui } from '@/utils/functions';
import CheckBoxComponent from '@/shared/Components/Inputs/CustomCheckbox/CheckBoxComponent.jsx';

/* The code is defining a React functional component called `TableActionComponent`. Este componente
  se utiliza cuando se necesita una tabla con filtros. */
function TableActionComponent({
  headerButtons,
  headerTable,
  actionButtons = { title: 'Acciones', buttons: [] },
  tableBodyData,
  resetTableOnChange = true,
  inputFilter = true,
  pagination = true,
  elevation = 3,
  children = null,
}) {
  const {
    setFilter,
    handleClearFilter,
    handleChangePage,
    handleChangeRowsPerPage,
    setCheckedItems,
    filter,
    checkedItems,
    page,
    rowsPerPage,
    filteredBody,
    paginatedBody,
    colors,
  } = useTableAccion(tableBodyData, headerTable, resetTableOnChange);

  return (
    <Paper elevation={elevation} sx={{ padding: 1 }}>
      {children && <>{children}</>}
      <Grid container spacing={2} sx={{ marginBottom: 0, marginTop: '5px' }}>
        {headerButtons.map(
          ({ name, handleClick, color = 'success', disabled }, index) =>
            !disabled &&
            !!tableBodyData.length && (
              <Grid item key={`HB${index}-${uuidv4()}`}>
                <Button
                  sx={{ background: color }}
                  disableFocusRipple
                  disableTouchRipple
                  disabled={disabled}
                  variant="contained"
                  color={setColorsMui(color)}
                  type="button"
                  onClick={(e) =>
                    handleClick(
                      e,
                      Object.entries(checkedItems)
                        ?.filter((el) => !!el[1])
                        .map((elem) => elem[0])
                    )
                  }
                >
                  {name}
                </Button>
              </Grid>
            )
        )}
      </Grid>
      {inputFilter && !!tableBodyData.length && (
        <Grid container>
          <Grid item xs={12}>
            <TextField
              placeholder="Filtrar"
              variant="outlined"
              size="small"
              color="success"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              InputProps={{
                endAdornment: (
                  <IconButton size="small" onClick={handleClearFilter}>
                    {filter ? <ClearIcon /> : <FilterAltIcon />}
                  </IconButton>
                ),
              }}
              sx={{ float: 'right' }}
            />
          </Grid>
        </Grid>
      )}
      <Table>
        <TableHead>
          <TableRow>
            {headerTable.map((header, index) => {
              return (
                <TableCell
                  key={`HT${index}-${uuidv4()}`}
                  width={header.width || undefined}
                  sx={{
                    marginTop: 2,
                    fontWeight: 'bold',
                    textAlign: 'center',
                    paddingBottom: 0,
                    // ...(header.width && { minWidth: header.width }),
                    ...(header.special && {
                      fontSize: 20,
                      color: 'darkgrey',
                    }),
                  }}
                >
                  {header.name}
                </TableCell>
              );
            })}
            {!!actionButtons?.buttons?.length && (
              <TableCell
                align="center"
                sx={{ fontWeight: 'bold', paddingBottom: 0 }}
              >
                {actionButtons.title}
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {paginatedBody.map((row, indexRow) => {
            return (
              <TableRow key={`PB${row.rowIndex}${indexRow}-${uuidv4()}`}>
                {headerTable.map((header) => (
                  <TableCell
                    key={`HT${row.rowIndex}-${header.key}`}
                    align="center"
                  >
                    {header.type === 'checkbox' ? (
                      <CheckBoxComponent
                        color={colors.primary}
                        checked={
                          !!checkedItems[findPrimaryKeyValue(row)] ||
                          !!row?.isChecked
                        }
                        handleOnChange={(isChecked) => {
                          setCheckedItems((prev) => ({
                            ...prev,
                            [findPrimaryKeyValue(row)]: isChecked,
                          }));
                        }}
                      />
                    ) : header.show ? (
                      header.show(row[header.key])
                    ) : (
                      row[header.key]
                    )}
                  </TableCell>
                ))}
                {!!actionButtons?.buttons?.length && (
                  <TableCell sx={{ padding: 1 }} align="center">
                    {actionButtons?.buttons.map(
                      (
                        {
                          name,
                          titButton = null,
                          handleClick,
                          icon: Icon,
                          color = 'success',
                        },
                        index
                      ) => (
                        <Tooltip
                          placement="left-start"
                          title={titButton ?? name}
                          key={`AB${index}-${uuidv4()}`}
                          arrow
                        >
                          {!Icon ? (
                            <Button
                              sx={{ p: 1, background: color }}
                              type="button"
                              variant="contained"
                              color={setColorsMui(color)}
                              onClick={() =>
                                handleClick(
                                  row['rowIndex'],
                                  !!checkedItems[findPrimaryKeyValue(row)]
                                )
                              }
                            >
                              {name}
                            </Button>
                          ) : (
                            <IconButton
                              sx={{ color: color }}
                              color={color}
                              onClick={() =>
                                handleClick(
                                  row['rowIndex'],
                                  !!checkedItems[findPrimaryKeyValue(row)]
                                )
                              }
                            >
                              {<Icon />}
                            </IconButton>
                          )}
                        </Tooltip>
                      )
                    )}
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {pagination && (
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredBody.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      )}
    </Paper>
  );
}

export default TableActionComponent;
