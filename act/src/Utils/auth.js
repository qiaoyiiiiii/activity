const auth = {
  mounted(el, binding) {
    if (!isLoggedIn()) {
      el.style.display = 'none';
    }
  }
};

export function checkToken() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  return proxy.$request.get('/api/auth/validate-token')
    .then(() => true)
    .catch(() => {
      localStorage.removeItem('token');
      return false;
    });
}

export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('userid');
  window.location.href = '/login';
}

// 添加默认导出
export default auth;
