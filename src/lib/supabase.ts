/**
 * REQUIRED SUPABASE DASHBOARD SETUP:
 * 
 * 1. Go to your Supabase project → Authentication → URL Configuration
 *    Add to "Redirect URLs":
 *      http://localhost:5173/discover
 *      http://localhost:5173/**
 *      https://your-production-domain.com/discover
 *      https://your-production-domain.com/**
 * 
 * 2. Go to Authentication → Settings:
 *    Enable "Enable email confirmations" → OFF (for OTP flow, not needed)
 *    Enable "Enable Email OTP" → ON
 *    Set OTP expiry: 600
 * 
 * 3. Do NOT enable Google provider unless you have:
 *    - A Google Cloud Console project
 *    - OAuth 2.0 credentials (Client ID + Secret)
 *    - Authorized redirect URI set to your Supabase callback URL
 *    Google OAuth is removed from UI for now.
 * 
 * 4. Site URL: set to http://localhost:5173 for development.
 */

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
