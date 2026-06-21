
import { PassThrough } from "stream";
import { Get,Post, Controller,Req,Request,Query,Headers,Session,Ip,Param,Body,Response } from "./@nestjs/common";
import { Request as ExpressRequest,Response as ExpressResponse  } from "express";
@Controller('users')
export class UserController{
    @Get('hello')
    handleRequest(@Req() req: ExpressRequest,@Request() request: ExpressRequest){
        console.log(req.url)
        console.log(req.path)
        console.log(req.method)
        return 'Hello User'
    }

    @Get('query')
    handleQuery(@Query() query: any,@Query('id') id: string){
        console.log(query);
        
        console.log(id);
        
        return `id: ${query.id}`
        
    }
    @Get('headers')
    handleHeaders(@Headers() headers: any,@Headers('accept') accept: string){
        console.log(headers);
        
        console.log(accept);
        
        return `accept: ${accept}`
        
    }
    @Get('session')
    handleSession (@Session() session: any,@Session('pageView') pageView: string){
        console.log(session);
        
        console.log(pageView);
        if(session.pageView){
            session.pageView++
        }else{
            session.pageView = 1
        }
        return `pageView: ${pageView}`
        
    }
    @Get('ip')
    getUserIp(@Ip() ip: string,){
        console.log(ip);
        return `ip: ${ip}`
        
    }
    @Get(':username/info/:age')
    getUsernameInfo(@Param() Param: any,@Param('username') username: string,@Param('age') age: string){
        console.log(Param);
        console.log(username);
        console.log(age);
        return `age: ${age} username:${username}`
        
    }
    @Get('start/ab*de')
    handleWildcard(){
     
        return 'Wildcard'
    }
    @Post('create')
    createUser(@Body() createUserDto,@Body('name') name: string){
        console.log(createUserDto);
        console.log(name);
        
        return 'user created'
    }
    
    @Get('response')
    response(@Response({passthrough:true}) response:ExpressResponse){

        response.setHeader('key','value')
        return 'response'
    }
}
