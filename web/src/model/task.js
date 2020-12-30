export class Task {
  constructor(name, file, jobTypes, sampleRate) {
    this.name = name;
    this.file = file;
    this.jobTypes = jobTypes;
    this.sampleRate = sampleRate;
  }
}


export class TaskStatus{
  constructor(name, taskFilePath, jobTypes, sampleRate,user,samplePicPath,jobStatusList){
    this.name = name;
    this.taskFilePath = taskFilePath;
    this.jobTypes = jobTypes;
    this.sampleRate = sampleRate;
    this.user=user
    this.samplePicPath=samplePicPath
    this.jobStatusList=jobStatusList
  }
}