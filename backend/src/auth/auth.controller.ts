import { Body, Controller, Post, Get, Query, Patch, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserQueryDto } from './dto/user-query.dto';
import { Request } from 'express';
import { SupabaseAuthGuard } from './supabase-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user' })
  @ApiResponse({ status: 201, description: 'User registered' })
  async register(
    @Body() body: RegisterDto
  ) {
    const { full_name, email, password, type } = body;
    return this.authService.register(full_name, email, password, type);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login a user' })
  @ApiResponse({ status: 200, description: 'User logged in' })
  async login(
    @Body() body: LoginDto
  ) {
    const { email, password } = body;
    return this.authService.login(email, password);
  }

  @Post('forgot-password')
  @ApiOperation({ summary: 'Send a password reset email' })
  @ApiResponse({ status: 200, description: 'Password reset email sent' })
  async forgotPassword(
    @Body() body: ForgotPasswordDto
  ) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  @ApiOperation({ summary: 'Reset password using access token' })
  @ApiResponse({ status: 200, description: 'Password updated' })
  async resetPassword(
    @Body() body: ResetPasswordDto
  ) {
    return this.authService.resetPassword(body.access_token, body.new_password);
  }

  @Post('logout')
  @ApiOperation({ summary: 'Logout user' })
  @ApiResponse({ status: 200, description: 'User logged out' })
  async logout() {
    return this.authService.logout();
  }

  @Post('update-profile-picture')
  @ApiOperation({ summary: 'Update user profile picture' })
  @ApiResponse({ status: 200, description: 'Profile picture updated' })
  async updateProfilePicture(
    @Body() body: UpdateProfileDto & { user_id: string }
  ) {
    return this.authService.updateProfilePicture(body.user_id, body.avatar_url);
  }

  @Post('verify-email')
  @ApiOperation({ summary: 'Verify user email address' })
  @ApiResponse({
    status: 200,
    description: 'Email verified successfully',
    type: Object,
  })
  async verifyEmail(@Body() dto: VerifyEmailDto): Promise<{ message: string }> {
    return this.authService.verifyEmail(dto);
  }

  @Get('users')
  @ApiOperation({ summary: 'Get all users with pagination and filters' })
  @ApiResponse({ status: 200, description: 'List of users' })
  async getAllUsers(@Query() query: UserQueryDto) {
    return this.authService.getAllUsers(query);
  }

  @Patch('me')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Update current user profile (club)' })
  @ApiResponse({ status: 200, description: 'Profile updated' })
  async updateMe(@Req() req: Request) {
    const { full_name, description } = req.body;
    const userId = (req as any).user?.id;
    return this.authService.updateClub(userId, full_name, description);
  }

  @Get('me')
  @ApiBearerAuth('access-token')
  @UseGuards(SupabaseAuthGuard)
  @ApiOperation({ summary: 'Get current user profile' })
  @ApiResponse({ status: 200, description: 'Current user profile' })
  async getMe(@Req() req: Request) {
    const userId = (req as any).user?.id;
    return await this.authService.getUserById(userId);
  }
} 