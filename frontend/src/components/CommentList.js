import React, { useEffect, useState } from "react";
import { fetchComments, addComment } from "../api/api";

export default function CommentList({ taskId, userId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");

  useEffect(() => {
    if (taskId) fetchComments(taskId).then(setComments);
  }, [taskId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newComment = await addComment(taskId, text, userId);
    setComments([...comments, newComment]);
    setText("");
  };

  return (
    <div className="comments">
      <h3>Comentarios</h3>
      <ul>
        {comments.map((c) => (
          <li key={c._id}>{c.content}</li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un comentario..."
        />
        <button type="submit">Enviar</button>
      </form>
    </div>
  );
}