import { request } from './axios';

export function checkToken() {
  const token = localStorage.getItem('token');
  if (!token) return false;

  // 可以添加token验证请求
  return request.get('/api/auth/validate-token')
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
