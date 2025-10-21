const API_BASE = "http://localhost:4000/api";

function getToken() {
  return localStorage.getItem("token");
}

function getHeaders(isJson = true) {
  const headers = {};
  if (isJson) headers["Content-Type"] = "application/json";

  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  return headers;
}

export async function fetchUsers() {
  const res = await fetch(`${API_BASE}/users`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${API_BASE}/projects`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener proyectos");
  return res.json();
}

export async function fetchTasks(projectId) {
  const res = await fetch(`${API_BASE}/tasks/project/${projectId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener tareas");
  return res.json();
}

export async function fetchComments(taskId) {
  const res = await fetch(`${API_BASE}/comments/task/${taskId}`, {
    headers: getHeaders(),
  });
  if (!res.ok) throw new Error("Error al obtener comentarios");
  return res.json();
}

export async function addComment(taskId, content, userId) {
  const res = await fetch(`${API_BASE}/comments`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ taskId, content, userId }),
  });
  if (!res.ok) throw new Error("Error al agregar comentario");
  return res.json();
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Credenciales inválidas");

  const data = await res.json();

  if (data.token) {
    localStorage.setItem("token", data.token);
  }

  return data;
}

export async function registerUser(name, email, password) {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ name, email, password }),
  });

  if (!res.ok) throw new Error("Error al registrar usuario");
  return res.json();
}
