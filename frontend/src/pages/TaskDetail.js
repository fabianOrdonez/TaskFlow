import React from "react";
import CommentList from "../components/CommentList";
import Home from "../components/AppBar"
export default function TaskDetail({ task }) {
  if (!task) return null;
  return (
    <div className="task-detail">
      
      <Home />
      <h2>{task.title}</h2>
      <p>{task.description}</p>
      <CommentList taskId={task._id} userId={"68f6be48642007fe5b02b975"} />
    </div>
  );
}