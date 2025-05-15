import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { supabase } from '../utils/supabase/supabase.client';
import { VerifyEmailDto } from './dto/verify-email.dto';
import * as jwt from 'jsonwebtoken';
import { createClient } from '@supabase/supabase-js';

@Injectable()
export class AuthService {
  // Register a new user or club
  async register(full_name: string, email: string, password: string, type: 'user' | 'club') {
    // Generate a verification token using a Postgres function
    const { data: tokenData, error: tokenError } = await supabase
      .rpc('generate_verification_token');
    // Sign up the user with Supabase Auth
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `http://localhost:3000/verify-email?token=${tokenData}`,
        data: {
          full_name,
          is_active: false,
          type,
        },
      },
    });
    if (error) return { error: error.message };
    // Insert user profile into users table
    const user = data.user;
    if (user) {
      const { error: insertError } = await supabase.from('users').insert([
        {
          id: user.id,
          full_name,
          is_active: false,
          email,
          verification_token: tokenData,
          verification_token_expires_at: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
          type,
        },
      ]);
      
      if (insertError) return { error: insertError.message };
    }
    return { user };
  }

  // Login a user and return access token and user profile
  async login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (!data) {
      throw new UnauthorizedException('Invalid credentials');
    }
    
    // Get user data with profile
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', data?.session?.user?.id)
      .single();

    if (userError || !userData) {
      throw new UnauthorizedException('User profile not found');
    }

    // Check if user is active and approved
    if (!userData.is_active) {
      throw new UnauthorizedException('Your account is not active');
    }
    if (error) return { error: error.message };
    return { access_token: data.session.access_token, user: userData };
  }

  // Send a password reset email
  async forgotPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'http://localhost:3000/reset-password?type=recovery',
    });
    if (error) return { error: error.message };
    return { message: 'Password reset email sent', data };
  }
  
  // Reset a user's password using the access token
  async resetPassword(access_token: string, new_password: string) {
    const decoded: any = jwt.decode(access_token);
    const user_id = decoded?.sub;
    if (!user_id) return { error: 'Invalid token' };
  
    // Use the service role key for admin client
    const supabaseAdmin = createClient(
      process.env.SUPABASE_URL as string, 
      process.env.SUPABASE_SERVICE_ROLE_KEY as string
    );
  
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(user_id, {
      password: new_password,
    });
    if (error) return { error: error.message };
    return { message: 'Password updated', data };
  }

  // Logout the current user
  async logout() {
    const { error } = await supabase.auth.signOut();
    if (error) return { error: error.message };
    return { message: 'Logged out' };
  }

  // Update the user's profile picture
  async updateProfilePicture(user_id: string, avatar_url: string) {
    const { error } = await supabase.from('users').update({ avatar_url }).eq('id', user_id);
    if (error) return { error: error.message };
    return { message: 'Profile picture updated', avatar_url };
  }

  // Verify a user's email using a verification token
  async verifyEmail(dto: VerifyEmailDto): Promise<{ message: string }> {
    const { data, error } = await supabase.rpc('verify_email', {
      token: dto.access_token,
    });
    console.log(error, data);
    if (error) {
      throw new BadRequestException('Invalid or expired verification token', error);
    }

    if (!data) {
      throw new BadRequestException(`Invalid or expired verification token ${error}`);
    }

    return { message: 'Email verified successfully' };
  }

  // Get all users with optional filters and pagination
  async getAllUsers(query: any) {
    const { page = 1, limit = 10, search, type, is_active } = query;
    let supaQuery = supabase.from('users').select('*', { count: 'exact' });
    if (search) {
      supaQuery = supaQuery.ilike('full_name', `%${search}%`).or(`email.ilike.%${search}%`);
    }
    if (type) {
      supaQuery = supaQuery.eq('type', type);
    }
    if (typeof is_active === 'boolean') {
      supaQuery = supaQuery.eq('is_active', is_active);
    }
    // Pagination logic
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    // Execute the query
    const { data, error, count } = await supaQuery.range(from, to);
    if (error) throw new BadRequestException(error.message);
    return {
      data,
      meta: {
        total: count,
        page,
        limit,
        totalPages: count ? Math.ceil(count / limit) : 0,
      },
    };
  }

  // Update a club's profile (full name and description)
  async updateClub(userId: string, full_name: string, description: string) {
    if (!userId) throw new BadRequestException('User ID is required');
    if (!full_name) throw new BadRequestException('Full name is required');
    const { data, error } = await supabase.from('users').update({ full_name, description }).eq('id', userId).select().single();
    if (error) throw new BadRequestException(error.message);
    return { message: 'Profile updated', data };
  }

  // Get a user by their ID
  async getUserById(userId: string) {
    const { data, error } = await supabase.from('users').select('*').eq('id', userId).single();
    if (error || !data) throw new BadRequestException('User not found');
    return data;
  }
} 