// ✅ Returns headers with X-Username from localStorage
export function getAuthHeaders() {
  const username = localStorage.getItem('username');
  return {
    'Content-Type': 'application/json',
    'X-Username': username
  };
}

// ✅ Checks if request is unauthorized and redirects to login
export function checkAndHandleAuthError(res, navigate) {
  if (res.status === 401 || res.status === 403) {
    alert("Session expired or unauthorized. Please log in again.");
    localStorage.clear();
    navigate('/');
    return false;
  }
  return true;
}
