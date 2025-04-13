import axios from "axios";
import { ElMessage } from 'element-plus';

// 定义基础 URL
const baseURL = "http://47.106.74.196";

// 创建 Axios 实例
const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000, // 请求超时时间
  withCredentials: true, // 允许跨域请求携带凭证
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': '3600'
  }
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 获取原始token字符串
    const tokenStr = localStorage.getItem("token");
    if (tokenStr) {
      // 移除引号，因为localStorage存储时可能带有引号
      const token = tokenStr.replace(/^"(.*)"$/, '$1');
      // 设置Authorization头
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          // 未授权，清除 token 并跳转到登录页
          localStorage.removeItem('token');
          window.location.href = '/login';
          break;
        case 403:
          // 禁止访问
          ElMessage.error('没有权限访问该资源');
          break;
        case 500:
          // 服务器错误
          ElMessage.error('服务器错误，请稍后重试');
          break;
        default:
          ElMessage.error(error.response.data.message || '请求失败');
      }
    } else if (error.request) {
      // 请求发出但未收到响应
      ElMessage.error('网络错误，请检查您的网络连接');
    } else {
      // 请求配置出错
      ElMessage.error('请求配置错误');
    }
    return Promise.reject(error);
  }
);

// 封装请求方法
const request = {
  get: (url, params, config) => instance.get(url, { params, ...config }),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data, config) => instance.put(url, data, config),
  delete: (url, config) => instance.delete(url, config),
};

// 创建插件
const axiosPlugin = {
  install(app) {
    app.config.globalProperties.$request = request;
  }
};

// });
