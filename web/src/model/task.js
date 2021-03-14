export class Task {
  constructor(name, edgeFile, nodeFile, jobTypes, sampleRate) {
    this.name = name;
    this.edgeFile = edgeFile;
    this.nodeFile = nodeFile;
    this.jobTypes = jobTypes;
    this.sampleRate = sampleRate;
  }
}

export class TaskStatus {
  constructor(
    name,
    taskFilePath,
    jobTypes,
    sampleRate,
    user,
    samplePicPath,
    jobStatusList,
  ) {
    this.name = name;
    this.taskFilePath = taskFilePath;
    this.jobTypes = jobTypes;
    this.sampleRate = sampleRate;
    this.user = user;
    this.samplePicPath = samplePicPath;
    this.jobStatusList = jobStatusList;
  }
}
