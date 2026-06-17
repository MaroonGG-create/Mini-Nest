import express,{Express,Request as ExpressRequest,Response as ExpressResponse,NextFunction} from 'express'
import { Logger } from './logger'
import path from 'path'
/**
 * NestApplication 类是 NestJS 框架的核心类，用于创建和配置 Nest 应用程序实例。
 * 它提供了启动应用、关闭应用以及配置应用的各种方法。
 * 继承自 INestApplication 接口，实现了一系列应用程序生命周期管理的方法。
 */
export class NestApplication {

  private readonly app:Express = express()

  constructor(protected readonly module) {}
  //配置初始化
  async init(){

    //初始化控制器
    const controllers = Reflect.getMetadata('controllers',this.module) ?? []
    Logger.log('AppModule dependencies initialized','InstanceLoader')

    for (const Controller of controllers) {
        //实例化控制器
        const controller = new Controller()

        //拿到控制器路由解析
        const prefix = Reflect.getMetadata("prefix",Controller) || '/';

        //拿到控制器路由解析
        Logger.log(`${Controller.name} {${prefix}}`,'RoutesResolver')


        //这里是获取到当前Controller的原型对象，原型对象上有所有方法的定义
        //Object.getOwnPropertyNames(controllerPrototype) 这个方法可以获取到对象自身的所有属性名，包括不可枚举属性，但不包括继承的属性。它返回一个包含对象自身属性名的数组。
        const controllerPrototype = Controller.prototype

        
        for (const methodName of Object.getOwnPropertyNames(controllerPrototype)) {
          console.log('methodName',methodName)
          console.log(controllerPrototype[methodName]);
          
          const method = controllerPrototype[methodName]
          
          //获取路由元数据
          const pathMatedata = Reflect.getMetadata('path',method)
          const httpMethod = Reflect.getMetadata('method',method)
          
          if(!httpMethod)continue
          const routePath= path.posix.join('/',prefix,pathMatedata)

          //注册路由
          this.app[httpMethod.toLowerCase()](routePath,(req: ExpressRequest, res: ExpressResponse, next: NextFunction)=>{
              const result = method.call(controller)
              res.send(result)
          })
          Logger.log(`Mapped {${routePath}}, ${httpMethod} route`,'RouterExplorer')
        }

    }
    Logger.log('Nest application successfully started','NestApplication')
  }
  /**
   * 启动应用程序并监听指定端口
   * @param port - 要监听的端口号
   */
  async listen(port){
      // 首先初始化应用程序
      await this.init()
      // 启动HTTP服务器并监听指定端口
      this.app.listen(port,()=>{
        // 记录应用程序启动日志，包括访问URL
        Logger.log(`Application is running on http://localhost:${port}`,'NestApplication')
      })
  }
}