
import 'reflect-metadata'

interface ModuleMetadata {
  controllers?: Function[];
}
export function Module(metadata:ModuleMetadata ):ClassDecorator {
  return (target:Function) => {
      //定义一个名为controllers的元数据，并将metadata.controllers的值赋给它，关联到target上
      Reflect.defineMetadata('controllers', metadata.controllers, target)
  }
}
