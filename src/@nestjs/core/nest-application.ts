import express,{Express,Request as ExpressRequest,Response as ExpressResponse,NextFunction} from 'express'
import { Logger } from './logger'
import path from 'path'
import { boolean } from 'zod/v4'

/**
 * NestApplication 类是 NestJS 框架的核心类，用于创建和配置 Nest 应用程序实例。
 * 它提供了启动应用、关闭应用以及配置应用的各种方法。
 * 继承自 INestApplication 接口，实现了一系列应用程序生命周期管理的方法。
 */
export class NestApplication {

  private readonly app:Express = express()

  constructor(protected readonly module) {
    this.app.use(express.json()) //用来把json格式的请求体放到req.body上
    this.app.use(express.urlencoded({ extended: true })) //把form表单格式的请求体对象放在req.body上
  }
  //配置初始化
/**
 * 使用中间件的方法
 * @param middleware - 要使用的中间件函数，可以是Express中间件或其他兼容的中间件
 * 该方法将传入的中间件添加到应用程序的中间件堆栈中
 */
  use(middleware: any){
    this.app.use(middleware) // 调用底层app实例的use方法来注册中间件
  }
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

          const method = controllerPrototype[methodName]
          
          //获取路由元数据
          const pathMatedata = Reflect.getMetadata('path',method)
          const httpMethod = Reflect.getMetadata('method',method)
          
          if(!httpMethod)continue
          const routePath= path.posix.join('/',prefix,pathMatedata)

          //注册路由
          this.app[httpMethod.toLowerCase()](routePath,(req: ExpressRequest, res: ExpressResponse, next: NextFunction)=>{
              const args = this.resolveParams(controller,methodName,req,res,next)
              //调用方法

              const result = method.call(controller,...args)
              
              //判断controller的methodName方法里有没有使用response或者res参数装饰器，如果有用到则不发响应
              const responseMetadata = this.getResponseMetadata(controller,methodName)
              //或者没有注入response参数装饰器，或者注入了但是传递了passthrough参数
              if(!responseMetadata || (responseMetadata?.data?.passthrough)){
                res.send(result)
              }
              
          })
          Logger.log(`Mapped {${routePath}}, ${httpMethod} route`,'RouterExplorer')
        }

    }
    Logger.log('Nest application successfully started','NestApplication')
  }
  private getResponseMetadata(controller,methodName){

      const paramsMetaData= Reflect.getMetadata(`params:${methodName}`,controller,methodName) ?? []

      return paramsMetaData.filter(Boolean).find((param)=>param.key ==='Res' || param.key ==='Response')
  }
  private resolveParams(instance:any,methodName:string,req: ExpressRequest, res: ExpressResponse, next: NextFunction){
    //获取方法参数元数据
    const paramsMetaData= Reflect.getMetadata(`params:${methodName}`,instance,methodName) ?? []

    return paramsMetaData.map((paramMetaData)=>{

      const {key,data} = paramMetaData
      switch (key) {
        case "Request":
        case "Req":
          return req
        case 'Query':
          //这里做的操作是，如果data存在，则返回req.query[data]的值，否则返回req.query的值
          //这里req.query是一个对象，可以通过key来获取对应的值
          return  data?req.query[data]:req.query 
        case 'Headers':  
          return data?req.headers[data]:req.headers
        case 'Session':
          return  data?(req as any).session[data]:(req as any).session
        case 'Ip':
          return  req.ip
        case 'Param':
          return  data?req.params[data]:req.params
        case 'Body':
          return  data?req.body[data]:req.body       
        case "Response":
        case "Res":
          return res;      
        default:
          return null  
      }
    })
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