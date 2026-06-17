import clc from 'cli-color'

export  class Logger{
  //定义一个打印日志  的方法
  private static  lastLogTime= Date.now();
  static log(message: string,context?: string): void {
    // console.log(message,context);
    //获取时间戳
    const timestamp = new Date().toLocaleString();
    //获取进程id
    const pid= process.pid;
    const currentTime = Date.now();
    const timeDiff = currentTime - Logger.lastLogTime;
    Logger.lastLogTime = Date.now();
    console.log(`[${clc.green('Nest')}] ${clc.green(pid.toString())}  - ${clc.yellow(timestamp)}     ${clc.green('LOG')} [${clc.yellow(context)}] ${clc.green(message)} ${clc.white('+')}${clc.green(timeDiff)}${clc.white('ms')}`);;
    this.lastLogTime = currentTime
  }
}
