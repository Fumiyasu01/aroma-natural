# Supabase Authentication Setup Guide

## 1. Supabase Dashboard Settings

### Authentication Settings
1. Go to your Supabase Dashboard: https://app.supabase.com
2. Select your project: `syiowzvefgnmxlxgevco`
3. Navigate to **Authentication > URL Configuration**

### Required URL Settings
Set the following URLs in your Supabase dashboard:

#### Site URL
```
https://aroma-natural2.vercel.app
```

#### Redirect URLs (Add ALL of these)
```
https://aroma-natural2.vercel.app
https://aroma-natural2.vercel.app/
https://aroma-natural2.vercel.app/auth/callback
http://localhost:3000
http://localhost:3000/
http://localhost:3000/auth/callback
http://localhost:3002
http://localhost:3002/
http://localhost:3002/auth/callback
```

## 2. Email Authentication Setup

### Email Templates
1. Go to **Authentication > Email Templates**
2. Update the **Confirm signup** template:

```html
<h2>Confirm your signup</h2>

<p>Follow this link to confirm your user:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

Make sure the `{{ .ConfirmationURL }}` uses your production URL.

### Email Settings
1. Go to **Authentication > Providers > Email**
2. Ensure these settings:
   - Enable Email provider: ✅
   - Confirm email: ✅ (if you want email verification)
   - Enable email link (passwordless): ❌ (keep disabled for password-based auth)

## 3. Google OAuth Setup

### Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Go to **APIs & Services > Credentials**
5. Create OAuth 2.0 Client ID
6. Set Authorized JavaScript origins:
   ```
   https://syiowzvefgnmxlxgevco.supabase.co
   https://aroma-natural2.vercel.app
   http://localhost:3000
   http://localhost:3002
   ```
7. Set Authorized redirect URIs:
   ```
   https://syiowzvefgnmxlxgevco.supabase.co/auth/v1/callback
   ```
8. Copy the Client ID and Client Secret

### Supabase Google Provider
1. In Supabase Dashboard, go to **Authentication > Providers > Google**
2. Enable Google provider
3. Paste your Google Client ID and Client Secret
4. Save

## 4. Database Setup

### Users Table
Make sure you have a `users` table with proper RLS policies:

```sql
-- Create users table if not exists
CREATE TABLE IF NOT EXISTS public.users (
  id uuid REFERENCES auth.users(id) PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = id);
```

### Profiles Table
```sql
-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname text,
  experience_level text,
  owned_aromas jsonb DEFAULT '[]'::jsonb,
  goals jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = user_id);
```

## 5. Testing Authentication

### Test Email Signup
1. Go to https://aroma-natural2.vercel.app/signup
2. Enter email and password
3. Check email for confirmation link
4. Click confirmation link - should redirect to app

### Test Google Login
1. Go to https://aroma-natural2.vercel.app/login
2. Click "Googleでログイン"
3. Complete Google authentication
4. Should redirect back to app

## 6. Troubleshooting

### Email Confirmation Not Working
- Check spam folder
- Verify Site URL in Supabase dashboard
- Check email template has correct confirmation URL

### Google Login Not Working
- Verify Google OAuth credentials
- Check redirect URLs in both Google Console and Supabase
- Ensure popup blockers are disabled

### Session Not Persisting
- Check localStorage for `supabase.auth.token`
- Verify NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local

## 7. Environment Variables

Make sure your `.env.local` file has:
```env
NEXT_PUBLIC_SUPABASE_URL=https://syiowzvefgnmxlxgevco.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 8. Security Best Practices

1. **Never expose service role key** in client-side code
2. **Always use RLS policies** to protect data
3. **Validate user input** on both client and server
4. **Use HTTPS** in production
5. **Regularly rotate** API keys

## Next Steps

1. Configure all URLs in Supabase Dashboard
2. Set up Google OAuth (if needed)
3. Test authentication flow
4. Monitor authentication logs in Supabase Dashboard