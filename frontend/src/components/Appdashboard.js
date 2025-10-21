import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import List from "@mui/material/List";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import Checkbox from "@mui/material/Checkbox";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";

import { fetchProjects, fetchTasks } from "../api/api";
/** Funciones auxiliares */
function not(a, b) {
  return a.filter((value) => !b.includes(value));
}

function intersection(a, b) {
  return a.filter((value) => b.includes(value));
}

function union(a, b) {
  return [...a, ...not(b, a)];
}

export default function ProjectStatusManager(type_data,toEdit) {
  const [projects, setProjects] = useState([]);
  

  useEffect(() => {
    if (type_data.type === "Task") {
      if(type_data.toEdit)      
      fetchTasks(type_data.toEdit._id).then(setProjects);
    }
    else {
      fetchProjects().then(setProjects);
    }
  }, []);

  const [checked, setChecked] = useState([]);

  // Clasificamos los proyectos según su estado

  const [started, setStarted] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [finished, setFinished] = useState([]);
  useEffect(() => {
    if (projects && projects.length > 0) {
      setStarted(projects.filter((p) =>   p.status === "Sin inicial"||p.status === "por hacer"));
      setInProgress(projects.filter((p) =>  p.status === "in_progress"||p.status === "en progreso"));
      setFinished(projects.filter((p) =>  p.status === "finished"||p.status === "completada"));
    }
  }
    , [projects]);

  const startedChecked = intersection(checked, started);
  const inProgressChecked = intersection(checked, inProgress);
  const finishedChecked = intersection(checked, finished);

  const handleToggle = (project) => () => {
    const currentIndex = checked.indexOf(project);
    const newChecked = [...checked];

    if (currentIndex === -1) newChecked.push(project);
    else newChecked.splice(currentIndex, 1);

    setChecked(newChecked);
  };

  const numberOfChecked = (items) => intersection(checked, items).length;

  const handleToggleAll = (items) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  /** Movimiento entre columnas */
  const moveToInProgress = () => {
    setInProgress(inProgress.concat(startedChecked));
    setStarted(not(started, startedChecked));
    setChecked(not(checked, startedChecked));
  };

  const moveToFinished = () => {
    setFinished(finished.concat(inProgressChecked));
    setInProgress(not(inProgress, inProgressChecked));
    setChecked(not(checked, inProgressChecked));
  };

  const moveToStarted = () => {
    setStarted(started.concat(inProgressChecked));
    setInProgress(not(inProgress, inProgressChecked));
    setChecked(not(checked, inProgressChecked));
  };

  const moveBackToInProgress = () => {
    setInProgress(inProgress.concat(finishedChecked));
    setFinished(not(finished, finishedChecked));
    setChecked(not(checked, finishedChecked));
  };

  const updateProgress = () => {
    const resultFinished = finished.length > 0 ? finished.map(t => ({ ...t, status: "finished" })) : [];
    const resultInProgress = inProgress.length > 0 ? inProgress.map(t => ({ ...t, status: "in_progress" })) : [];
    const resultStarted = started.length > 0 ? started.map(t => ({ ...t, status: "Sin inicial" })) : [];
    const resultado = [...resultFinished, ...resultInProgress, ...resultStarted];

  };

  /** Render de cada lista */
  const renderList = (title, items, color) => (
    <Card sx={{ borderTop: `4px solid ${color}` }}>
      <CardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <Checkbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            disabled={items.length === 0}
          />
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} seleccionados`}
      />
      <Divider />
      <List
        sx={{
          width: 250,
          height: 300,
          bgcolor: "background.paper",
          overflow: "auto",
        }}
      >
        {items.map((p) => {
          const labelId = `project-${p._id}`;
          return (
            <ListItemButton key={p._id} onClick={handleToggle(p)}>
              <ListItemIcon>
                <Checkbox
                  checked={checked.includes(p)}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{ "aria-labelledby": labelId }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={p.name}
                secondary={p.description || p.email}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  return (
    <Grid
      container
      spacing={2}
      justifyContent="center"
      alignItems="center"
      sx={{ mt: 2 }}
    >

      <Grid item>{renderList("Iniciado", started, "#4caf50")}</Grid>

      {/* Botones entre iniciado y en proceso */}
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            onClick={moveToInProgress}
            disabled={startedChecked.length === 0}
          >
            ▶ En proceso
          </Button>
        </Grid>
      </Grid>


      <Grid item>{renderList("En Proceso", inProgress, "#ff9800")}</Grid>

      {/* Botones entre en proceso y finalizado */}
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            sx={{ mb: 1 }}
            variant="outlined"
            size="small"
            onClick={moveToStarted}
            disabled={inProgressChecked.length === 0}
          >
            ◀ Volver
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={moveToFinished}
            disabled={inProgressChecked.length === 0}
          >
            ▶ Finalizado
          </Button>
        </Grid>
      </Grid>


      <Grid item>{renderList("Finalizado", finished, "#f44336")}</Grid>

      {/* Botón para devolver de finalizado a en proceso */}
      <Grid item>
        <Grid container direction="column" alignItems="center">
          <Button
            variant="outlined"
            size="small"
            sx={{ mb: 1 }}
            onClick={moveBackToInProgress}
            disabled={finishedChecked.length === 0}
          >
            ◀ En proceso
          </Button>
          <Button
            variant="outlined"
            size="small"
            onClick={updateProgress}
          // disabled={finishedChecked.length === 0}
          >
            Guardar Estados
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
