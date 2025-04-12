import axios from 'axios';

// 定义基础 URL，如果需要的话
const baseURL = 'https://47.106.74.196';

// 创建 Axios 实例
const instance = axios.create({
  baseURL: baseURL,
  timeout: 10000, // 请求超时时间，单位为毫秒
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 在发送请求之前做些什么
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = token; // 将 token 添加到请求头
    }
    return config;
  },
  (error) => {
    // 处理请求错误
    return Promise.reject(error);
  }
);

// 添加响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    return response.data; // 通常我们只需要响应体中的数据
  },
  (error) => {
    // 处理响应错误
    return Promise.reject(error);
  }
);

// 封装常用的请求方法
const request = {
  get: (url, params, config) => instance.get(url, { params, ...config }),
  post: (url, data, config) => instance.post(url, data, config),
  put: (url, data, config) => instance.put(url, data, config),
  delete: (url, config) => instance.delete(url, config),
};

export default request;

// 如何使用：
// import request from './request';

// request.get('/users').then(data => {
//   console.log(data);
// }).catch(error => {
//   console.error(error);
// });

// request.post('/users', { name: 'John Doe' }).then(data => {
//   console.log(data);
// }).catch(error => {
//   console.error(error);
// });