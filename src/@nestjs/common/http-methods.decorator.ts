
import 'reflect-metadata'

export function Get():MethodDecorator {
  return (target:any, propertyKey:string, descriptor:PropertyDescriptor) => {
    // console.log('target', target)
    // console.log('propertyKey', propertyKey)
    // console.log('descriptor', descriptor)
  }

}
