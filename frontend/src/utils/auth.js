export function getAuthHeaders() {
  const username = localStorage.getItem('username');
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
  };

  if (username) headers['X-Username'] = username;  // ✅ REQUIRED
  if (token) headers['Authorization'] = `Bearer ${token}`;  // optional

  return headers;
}


// ✅ Handles 401 or 403 errors and redirects to login
export function checkAndHandleAuthError(res, navigate) {
  if (res.status === 401 || res.status === 403) {
    alert("Session expired or unauthorized. Please log in again.");
    localStorage.clear();
    navigate('/');
    return false;
  }
  return true;
}
