import * as React from "react";
import PropTypes from "prop-types";
import {
    alpha,
    Box,
    Paper,
    Toolbar,
    Typography,
    IconButton,
    Tooltip,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TablePagination,
    TableRow,
    Checkbox,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import FilterListIcon from "@mui/icons-material/FilterList";

function EnhancedTableToolbar({ numSelected, typeData }) {
    return (
        <Toolbar
            sx={[
                {
                    pl: { sm: 2 },
                    pr: { xs: 1, sm: 1 },
                },
                numSelected > 0 && {
                    bgcolor: (theme) =>
                        alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
                },
            ]}
        >
            {numSelected > 0 ? (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    color="inherit"
                    variant="subtitle1"
                    component="div"
                >
                    {numSelected} seleccionados
                </Typography>
            ) : (
                <Typography
                    sx={{ flex: "1 1 100%" }}
                    variant="h6"
                    id="tableTitle"
                    component="div"
                >
                    Registros
                </Typography>
            )}

            {numSelected === 1 ? (
                <div style={{ display: "flex", alignItems: "center", marginRight: "7rem" }}>

                    <Tooltip style={{ margin: "2rem" }} title="Detalles">
                        Detalles
                    </Tooltip>
                    <Tooltip hidden={typeData !== "projects"} title="Ver en Dashboard">
                        Ver en Dashboard
                    </Tooltip>
                    <Tooltip title="Eliminar">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>
                </div>

            ) :
                numSelected > 1 ? (


                    <Tooltip title="Eliminar">
                        <IconButton>
                            <DeleteIcon />
                        </IconButton>
                    </Tooltip>


                ) : (
                    <Tooltip title="Filtrar lista">
                        <IconButton>
                            <FilterListIcon />
                        </IconButton>
                    </Tooltip>
                )}
        </Toolbar>
    );
}

EnhancedTableToolbar.propTypes = {
    numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({ data = [], typeData = "" }) {
    const [selected, setSelected] = React.useState([]);
    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    if (!data || data.length === 0) {
        return (
            <Typography sx={{ mt: 2, textAlign: "center" }}>
                No hay datos disponibles
            </Typography>
        );
    }


    const columns = Object.keys(data[0]).filter(
        (key) => typeof data[0][key] !== "object" && key !== "__v"
    );

    const handleSelectAllClick = (event) => {
        if (event.target.checked) {
            const newSelected = data.map((n) => n._id || n.id);
            setSelected(newSelected);
            return;
        }
        setSelected([]);
    };

    const handleClick = (event, id) => {
        const selectedIndex = selected.indexOf(id);
        let newSelected = [];

        if (selectedIndex === -1) newSelected = newSelected.concat(selected, id);
        else if (selectedIndex === 0) newSelected = newSelected.concat(selected.slice(1));
        else if (selectedIndex === selected.length - 1)
            newSelected = newSelected.concat(selected.slice(0, -1));
        else if (selectedIndex > 0)
            newSelected = newSelected.concat(
                selected.slice(0, selectedIndex),
                selected.slice(selectedIndex + 1)
            );

        setSelected(newSelected);
    };

    const isSelected = (id) => selected.indexOf(id) !== -1;

    const handleChangePage = (event, newPage) => setPage(newPage);
    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const visibleRows = data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

    return (
        <Box sx={{ width: "100%" }}>
            <Paper sx={{ width: "100%", mb: 2 }}>
                <EnhancedTableToolbar numSelected={selected.length} typeData={typeData} />
                <TableContainer>
                    <Table sx={{ minWidth: 750 }}>
                        <TableHead>
                            <TableRow>
                                <TableCell padding="checkbox">
                                    <Checkbox
                                        color="primary"
                                        indeterminate={
                                            selected.length > 0 && selected.length < data.length
                                        }
                                        checked={data.length > 0 && selected.length === data.length}
                                        onChange={handleSelectAllClick}
                                    />
                                </TableCell>
                                {columns.map((col) => (
                                    <TableCell key={col} sx={{ fontWeight: "bold" }}>
                                        {col}
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {visibleRows.map((row) => {
                                const id = row._id || row.id;
                                const isItemSelected = isSelected(id);
                                return (
                                    <TableRow
                                        hover
                                        onClick={(event) => handleClick(event, id)}
                                        role="checkbox"
                                        aria-checked={isItemSelected}
                                        tabIndex={-1}
                                        key={id}
                                        selected={isItemSelected}
                                    >
                                        <TableCell padding="checkbox">
                                            <Checkbox color="primary" checked={isItemSelected} />
                                        </TableCell>
                                        {columns.map((col) => (
                                            <TableCell key={col}>
                                                {typeof row[col] === "boolean"
                                                    ? row[col]
                                                        ? "Sí"
                                                        : "No"
                                                    : String(row[col])}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={data.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Box>
    );
}

EnhancedTable.propTypes = {
    data: PropTypes.array.isRequired,
};
