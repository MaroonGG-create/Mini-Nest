import 'reflect-metadata'

export const createParamDecorator = (key: string) => {
  //target控制器原型对象，propertyKey 方法名，parameterIndex 参数索引
  return (data?:any)=>(target:any,propertyKey:string,parameterIndex:number)=>{

    const existingParameter = Reflect.getMetadata(`params:${propertyKey}`,target,propertyKey) || []
    // existingParameter.push({key,parameterIndex})
    existingParameter[parameterIndex] = {parameterIndex,key,data}
    //给控制器原型对象添加元数据propertyKey就是属性名，
    //属性名是params:方法名，属性值是一个数组，数组中存放的数据是表示哪个位置用哪个装饰器
    Reflect.defineMetadata(`params:${propertyKey}`,existingParameter,target,propertyKey)
  }

}


export const Request = createParamDecorator('Request')
export const Req = createParamDecorator('Req')
export const Query = createParamDecorator('Query')
export const Headers = createParamDecorator('Headers')
export const Session = createParamDecorator('Session')
export const Ip = createParamDecorator('Ip')
export const Param = createParamDecorator('Param')
export const Body = createParamDecorator('Body')
export const Response = createParamDecorator('Response')
export const Res = createParamDecorator('Res')