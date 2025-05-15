import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Request } from 'express';
import { supabase } from '../utils/supabase/supabase.client';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class SupabaseAuthGuard implements CanActivate {
  // This guard checks for a valid Supabase JWT in the Authorization header
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    // Get the Authorization header (case-insensitive)
    const authHeader = request.headers['authorization'] || request.headers['Authorization'];
    if (!authHeader) throw new UnauthorizedException('No authorization header');
    // Extract the token from the header
    const token = authHeader.toString().replace('Bearer ', '');
    if (!token) throw new UnauthorizedException('No token provided');

    try {
      // Validate JWT using Supabase's public key
      // Option 1: Use supabase-js getUser (preferred, but only works with service role key)
      // Option 2: Use jwt.verify with the JWT secret/public key (if available)
      // We'll use supabase.auth.getUser for now
      const { data, error } = await supabase.auth.getUser(token);
      if (error || !data?.user) throw new UnauthorizedException('Invalid or expired token');
      // Attach user to request for downstream use
      (request as any).user = data.user;
      return true;
    } catch (err) {
      throw new UnauthorizedException('Invalid or expired token');
    }
  }
} 