import clc from 'cli-color'

export  class Logger{
  //定义一个打印日志  的方法
  static log(message: string,context?: string): void {
    // console.log(message,context);
    //获取时间戳
    const timestamp = new Date().toLocaleString();
    //获取进程id
    const pid= process.pid;

    console.log(`[${clc.green('Nest')}] ${clc.green(pid)}  - ${clc.yellow(timestamp)}    LOG [${clc.green(context)}] ${message}`);

  }
}
