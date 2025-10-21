import React, { useEffect, useState } from "react";
import { fetchTasks } from "../api/api";

export default function TaskList({ projectId, onSelect }) {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    if (projectId) fetchTasks(projectId).then(setTasks);
  }, [projectId]);

  return (
    <div className="tasks">
      <h2>Tareas</h2>
      <ul>
        {tasks.map((t) => (
          <li key={t._id} onClick={() => onSelect(t)}>
            {t.title} — {t.status}
          </li>
        ))}
      </ul>
    </div>
  );
}