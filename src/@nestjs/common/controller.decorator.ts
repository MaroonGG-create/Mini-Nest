import "reflect-metadata";

interface ControllerOptions {
  prefix?: string;
}
//可以给conotroller装饰器传递一个可选的路径参数，表示该控制器处理的路由前缀
//前缀可以空，也可以写成字符串，也可以写非空字符串，也可能写成一个对象

export function Controller(): ClassDecorator; //穿空串
export function Controller(prefix: string): ClassDecorator; // 路径前缀
export function Controller(options: ControllerOptions): ClassDecorator; //传递对象
export function Controller(
  prefixOrOptions?: string | ControllerOptions,
): ClassDecorator {
  //参数归一化，将参数统一成对象
  let options: ControllerOptions = {};
  if (typeof prefixOrOptions === "string") {
    options.prefix = prefixOrOptions;
  } else if (typeof prefixOrOptions === "object") {
    options = prefixOrOptions;
  }
  return (target: Function) => {
    Reflect.defineMetadata("prefix", options.prefix || "", target);
  };
}