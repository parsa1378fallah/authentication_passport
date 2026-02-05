import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { LocalAuthGuard } from './guards/local-auth/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth/jwt-auth.guard';
import { RefreshAuthGuard } from './guards/refresh-auth/refresh-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('sign-up')
  create(@Body() createAuthDto: CreateAuthDto) {
    console.log(createAuthDto)
    return this.authService.registerUser(createAuthDto);
  }
  @UseGuards(LocalAuthGuard)
  @Post('sign-in')
  async signIn(@Request() req) {
    return this.authService.Login(req.user.id, req.user.firstName, req.user.lastName)
  }
  @UseGuards(JwtAuthGuard)
  @Get('protected')
  getAll(@Request() req) {
    return { message: `Now you can access this proteced Api ${req.user.id}` }
  }
  @UseGuards(RefreshAuthGuard)
  @Post('refresh')
  async refreshToken(@Request() req) {
    return this.authService.refreshToken(req.user.id, req.user.firstName, req.user.lastName)
  }

  @UseGuards(JwtAuthGuard)
  @Post('signout')
  signOut(@Req() req) {
    return this.authService.signOut(req.user.id)
  }


}
