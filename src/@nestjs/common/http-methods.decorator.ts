
import 'reflect-metadata'

export function Get(path:string =''):MethodDecorator {
  //target: 类方法原型对象 getHello.propertyKey: 
  //propertyKey: 方法名 
  //descriptor: 方法描述符
  return (target:any, propertyKey:string, descriptor:PropertyDescriptor) => {
    // console.log('target', target)
    // console.log('propertyKey', propertyKey)
    // console.log('descriptor', descriptor) 
    Reflect.defineMetadata('path', path, descriptor.value)
    //descriptor.value.path = path
    Reflect.defineMetadata('method', 'GET', descriptor.value)
    //descriptor.value.method = 'GET'
  }

}
