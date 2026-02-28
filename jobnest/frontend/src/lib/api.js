const API = "http://localhost:5000";

export function token() {
  return localStorage.getItem("token");
}

export function user() {
  try { return JSON.parse(localStorage.getItem("user") || "null"); }
  catch { return null; }
}

export async function api(path, { method="GET", body, auth=true } = {}) {
  const headers = {};
  if (!(body instanceof FormData)) headers["Content-Type"] = "application/json";
  if (auth && token()) headers.Authorization = `Bearer ${token()}`;

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body
      ? body instanceof FormData
        ? body
        : JSON.stringify(body)
      : undefined,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export async function uploadFile(path, file) {
  const form = new FormData();
  form.append("file", file);
  const data = await api(path, { method: "POST", auth: false, body: form });
  return data.url;
}