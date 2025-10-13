import axios from 'axios';

const service = axios.create({
  baseURL: import.meta.env.VITE_SERVICE_API_BASE || '/api',
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
  config => {
    // 可在此添加鉴权token等
    return config;
  },
  error => Promise.reject(error)
);

// 响应拦截器
service.interceptors.response.use(
  response => response,
  error => {
    // 统一错误处理
    alert(error?.response?.data || '请求失败');
    return Promise.reject(error);
  }
);

export default service;

