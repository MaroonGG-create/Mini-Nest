import { Get, Controller } from "./@nestjs/common";

@Controller('/cats')
export class AppController{

    @Get('hello')
    getHello(): string{
        return "Hello World"
    }
    @Get('info')
    info(): string{
        return "Info"
    }
}
