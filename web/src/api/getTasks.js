import api from "./index.js";
import { TaskStatus } from "../model/task";
import Axios from "axios";

export async function getTasks() {
  try {
    let data = await api.get("getTasks");
    let result = [];
    console.log("data", data);
    for (let i of data) {
      console.log(i);
      result.push(
        new TaskStatus(
          i.name,
          i.task_file,
          i.node_file,
          i.job_status,
          i.sample_rate,
          i.user,
          i.sample_pic_path,
          i.job_status_list
        )
      );
    }
    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getEdges(filename) {
  try {
    let data = await api.get("getEdges?" + filename);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getDegreeHistogram(filename) {
  try {
    let data = await api.get("getDegreeHistogram?" + filename);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getKMeans(filename) {
  try {
    let data = await api.get("getKmeans?" + filename);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getCluster(filename) {
  try {
    let data = await api.get("getCluster?" + filename);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function getPredictLink(filename) {
  try {
    let data = await api.get("getPredictLink?" + filename);
    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export async function downLoadFile(filename) {
  try {
    await api.get("downloadSample", {
      params: {
        file: filename,
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}

export const downLoad = async (filename) => {
  const queryArgs = {
    url: "/api/downloadSample",
    params: {
      file: filename,
    },
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json; charset=utf-8",
      withCredentials: true,
    },
  };
  // tips: 这里直接返回的是response整体!
  try {
    let response = await Axios.request(queryArgs);
    // 提取文件名
    const filename = response.headers["content-disposition"].match(
      /filename=(.*)/
    )[1];
    // 将二进制流转为blob
    const blob = new Blob([response.data], {
      type: "application/octet-stream",
    });
    if (typeof window.navigator.msSaveBlob !== "undefined") {
      // 兼容IE，window.navigator.msSaveBlob：以本地方式保存文件
      window.navigator.msSaveBlob(blob, decodeURI(filename));
    } else {
      // 创建新的URL并指向File对象或者Blob对象的地址
      const blobURL = window.URL.createObjectURL(blob);
      // 创建a标签，用于跳转至下载链接
      const tempLink = document.createElement("a");
      tempLink.style.display = "none";
      tempLink.href = blobURL;
      tempLink.setAttribute("download", decodeURI(filename));
      // 兼容：某些浏览器不支持HTML5的download属性
      if (typeof tempLink.download === "undefined") {
        tempLink.setAttribute("target", "_blank");
      }
      // 挂载a标签
      document.body.appendChild(tempLink);
      tempLink.click();
      document.body.removeChild(tempLink);
      // 释放blob URL地址
      window.URL.revokeObjectURL(blobURL);
    }
  } catch (error) {
    console.log(error);
    throw error;
  }
};
