import { Get, Controller,Req,Request } from "./@nestjs/common";
import { Request as ExpressRequest  } from "express";
@Controller('users')
export class UserController{
    @Get('hello')
    handleRequest(@Req() req: ExpressRequest,@Request() request: ExpressRequest){
        console.log('req', req)

        return 'Hello User'
    }
}
