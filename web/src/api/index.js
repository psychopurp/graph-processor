import axios from "axios";
import { message } from "antd";

const instance = axios.create({
  baseURL: "/api",
});

instance.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    //config是axios请求的参数
    // console.log(config);
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function (response) {
    // 对响应数据做点什么
    // response 是请求回来的数据
    console.log(response);
    if (response.data.st !== 0) {
      message.error(response.data.msg);
      return Promise.reject(response.data.msg);
    }

    return Promise.resolve(response.data.data);
  },
  function (error) {
    // 对响应错误做点什么
    message.error(`${error}`);
    console.log(error);
    return Promise.reject(error);
  }
);

export default instance;
