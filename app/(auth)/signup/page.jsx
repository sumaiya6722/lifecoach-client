'use client';

import Link from 'next/link';
import { authClient } from '../../lib/auth-client';
import {
  Form,
  Fieldset,
  FieldGroup,
  TextField,
  Label,
  Input,
  Description,
  FieldError,
  Button
} from '@heroui/react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/navigation';


export default function SignUp() {

  const route = useRouter();

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    const plan = user?.role === 'user'? 'user_free' : 'admin_free'

    try {
      // 1. Better Auth Email Sign-Up
      const { data, error } = await authClient.signUp.email({
        name: user.name,
        email: user.email,
        password: user.password,
        image: user?.image || '',
        role: user?.role,
        plan: plan,
        callbackURL: "/",
      });

      if (data) {
        toast.success('Signed up successfully!');
        setTimeout(() => {
          route.push('/');
        }, 1000);
      } else {
        toast.error(error?.message || 'Something went wrong during Sign Up!');
      }
    } catch (err) {
      console.error("Sign up error:", err);
      toast.error('Failed to sign up. Please try again.');
    }
  };

  // ==========================================
  // GOOGLE SIGN-IN HANDLER
  // ==========================================
  const signInWithGoogle = async () => {
    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });
    } catch (err) {
      console.error("Google sign-in error:", err);
      toast.error("Failed to sign in with Google.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Form className="w-full max-w-md bg-blue-200 p-8 sm:p-10 rounded-xl shadow-md" onSubmit={onSubmit}>
        <Fieldset>
          {/* Header */}
          <Fieldset.Legend className="text-2xl font-bold">Sign Up</Fieldset.Legend>
          <Description>Sign up to join with us in this journey..</Description>

          <FieldGroup className="mt-4 flex flex-col">
            {/* Name */}
            <TextField
              isRequired
              name="name"
              validate={(value) => {
                if (value.length < 3) return "Name must be at least 3 characters";
                return null;
              }}
            >
              <Label>Name</Label>
              <Input placeholder="John Doe" />
              <FieldError />
            </TextField>

            {/* Profile Photo URL */}
            <TextField
              name="image"
              type="url"
              validate={(value) => {
                if (value && !/^https?:\/\/.+/i.test(value)) {
                  return "Please enter a valid image URL (e.g. https://...)";
                }
                return null;
              }}
            >
              <Label>Profile Photo URL</Label>
              <Input placeholder="https://i.pravatar.cc/150" />
              <Description>Optional link to your avatar image</Description>
              <FieldError />
            </TextField>

            {/* Email */}
            <TextField
              isRequired
              name="email"
              type="email"
              validate={(value) => {
                if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
                  return "Please enter a valid email address";
                }
                return null;
              }}
            >
              <Label>Email</Label>
              <Input placeholder="john@example.com" />
              <FieldError />
            </TextField>

            {/* Password */}
            <TextField
              isRequired
              minLength={6}
              name="password"
              type="password"
              validate={(value) => {
                if (value.length < 6) return "Password must be at least 6 characters";
                if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
                if (!/[0-9]/.test(value)) return "Password must contain at least one number";
                return null;
              }}
            >
              <Label>Password</Label>
              <Input placeholder="Enter your password" />
              <Description>Must be at least 8 characters with 1 uppercase and 1 number</Description>
              <FieldError />
            </TextField>


            {/* Account Role Selection */}
            <div className="flex flex-col gap-2 my-4">
              <div className="flex flex-col gap-2">

                {/* Starter Option */}
                <label className="flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-blue-300 cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    defaultChecked
                    className="w-4 h-4 accent-blue-600 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-gray-800 text-sm">User</div>
                    {/* <div className="text-xs text-gray-600">For side projects</div> */}
                  </div>
                </label>

                {/* Pro Option */}
                <label className="flex items-center gap-3 bg-white/60 p-3 rounded-lg border border-blue-300 cursor-pointer hover:bg-white transition-colors">
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    className="w-4 h-4 accent-blue-600 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-gray-800 text-sm">Admin</div>
                    {/* <div className="text-xs text-gray-600">Advanced reporting</div> */}
                  </div>
                </label>

                {/* Teams Option */}
              </div>
            </div>

          </FieldGroup>

          {/* Actions */}
          <Fieldset.Actions className="mt-6 flex flex-col sm:flex-row gap-2">
            <Button type="submit" className="w-full sm:w-auto bg-amber-400 text-black font-bold flex items-center justify-center gap-2">
              Submit
            </Button>
            <Button type="reset" variant="secondary" className="w-full sm:w-auto">
              Cancel
            </Button>
          </Fieldset.Actions>
        </Fieldset>

        {/* Divider */}
        <div className="relative my-6 text-center">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-blue-300" />
          </div>
          <span className="relative bg-blue-200 px-3 text-xs font-bold text-gray-600 uppercase">
            OR
          </span>
        </div>

        {/* Google Sign-In Button */}
        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-700 font-bold py-2.5 px-4 rounded-xl border border-gray-300 shadow-xs transition-colors cursor-pointer"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Login Redirect */}
        <div className="flex gap-1 text-gray-600 justify-center mt-4 text-sm">
          <span>Already Registered?</span>
          <Link className="text-amber-900 font-semibold hover:underline" href="/login">
            Login
          </Link>
        </div>
      </Form>
    </div>
  );
}