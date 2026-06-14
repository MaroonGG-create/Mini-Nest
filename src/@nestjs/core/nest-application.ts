import express,{Express} from 'express'
import { Logger } from './logger'

/**
 * NestApplication 类是 NestJS 框架的核心类，用于创建和配置 Nest 应用程序实例。
 * 它提供了启动应用、关闭应用以及配置应用的各种方法。
 * 继承自 INestApplication 接口，实现了一系列应用程序生命周期管理的方法。
 */
export class NestApplication {

  private readonly app:Express = express()

  constructor(protected readonly module) {}
  async init(){}
  async listen(port){
      await this.init()
      this.app.listen(port,()=>{
        Logger.log(`Application is running on http://localhost:${port}`,'NestApplication')
      })
  }
}