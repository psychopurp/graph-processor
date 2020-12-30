import api from "./index.js";
import { TaskStatus } from "../model/task";

export async function getTasks() {
  try {
    let data = await api.get("getTasks");
    let result = [];
    console.log("data",data);
    for (let i of data) {
      console.log(i);
      result.push(new TaskStatus(i.name,i.task_file,i.job_status,i.sample_rate,i.user,i.sample_pic_path,i.job_status_list));
    }
    return result
  } catch (error) {
    console.log(error);
    throw error;
  }
}
