"use client";

import React from "react";
import { FloppyDisk } from "@gravity-ui/icons";
import { toast } from 'react-toastify';
import {
  Button,
  Description,
  FieldError,
  FieldGroup,
  Fieldset,
  Form,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import { authClient } from "../../lib/auth-client"; // Adjust path if needed (e.g., "@/lib/auth-client")

export default function LogIn() {

  const onSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const user = Object.fromEntries(formData.entries());

    try {
      // 1. Better Auth Email Sign-Up
      const { data, error } = await authClient.signIn.email({
        name: user.name,
        email: user.email,
        password: user.password,
        image: user?.image || '',
        callbackURL: "/",
      });

      if (data) {

        toast.success('Signed up successfully!');
        setTimeout(() => {
          route.push('/');
        }, 1000);
      } else {
        toast.error(error?.message || 'Something went wrong during Log in!');
      }
    } catch (err) {
      console.error("Log in error:", err);
      toast.error('Failed to log in. Please try again.');
    }
  };


  const signInWithGoogle = async () => {
    // Added callbackURL for OAuth redirection
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/",
    });
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-8">
      {/* Container matched with lifeCoach glassmorphism theme */}
      <div className="w-full max-w-md bg-white/90 backdrop-blur-md border border-gray-100 rounded-3xl shadow-xl p-8 sm:p-10 relative overflow-hidden">

        {/* Ambient Decorative Glows */}
        <div className="absolute -top-16 -right-16 w-48 h-48 bg-amber-200/40 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-emerald-200/30 rounded-full blur-2xl pointer-events-none" />

        <Form className="w-full space-y-6 relative z-10" onSubmit={onSubmit}>
          <Fieldset>
            <Fieldset.Legend className="text-3xl font-extrabold text-gray-900 text-center tracking-tight">
              Welcome <span className="text-amber-500">Back</span>
            </Fieldset.Legend>
            <Description className="text-center text-gray-500 text-sm mb-6">
              Sign in to your lifeCoach account to continue sharing wisdom.
            </Description>

            <FieldGroup className="space-y-4">
              {/* Email Input */}
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
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">Email</Label>
                <Input placeholder="john@example.com" className="w-full bg-gray-300 dark:text-black" />
                <FieldError />
              </TextField>

              {/* Password Input */}
              <TextField
                isRequired
                minLength={6}
                name="password"
                type="password"
                validate={(value) => {
                  if (value.length < 6) {
                    return "Password must be at least 6 characters";
                  }
                  if (!/[A-Z]/.test(value)) {
                    return "Password must contain at least one uppercase letter";
                  }
                  if (!/[0-9]/.test(value)) {
                    return "Password must contain at least one number";
                  }
                  return null;
                }}
              >
                <Label className="text-xs font-bold uppercase tracking-wider text-gray-700">Password</Label>
                <Input placeholder="Enter your password" className="w-full bg-gray-300 dark:text-black" />
                <Description className="text-[11px] text-gray-400">
                  Must be at least 8 characters with 1 uppercase & 1 number
                </Description>
                <FieldError />
              </TextField>

              {/* <div className="flex flex-col gap-2 my-2">
                <Label className="font-bold text-sm text-gray-800">Account Role</Label>
                <div className="flex items-center gap-6 bg-white/70 p-3 rounded-lg border border-blue-300">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                    <input
                      type="radio"
                      name="role"
                      value="user"
                      defaultChecked
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                    User
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-gray-700">
                    <input
                      type="radio"
                      name="role"
                      value="admin"
                      className="accent-amber-500 w-4 h-4 cursor-pointer"
                    />
                    Admin
                  </label>
                </div>
              </div> */}
            </FieldGroup>

            {/* Form Actions */}
            <Fieldset.Actions className="mt-6 flex flex-col gap-3">
              <Button type="submit" className="w-full bg-[#0b1b3d] hover:bg-emerald-600 text-white font-medium rounded-full py-3 flex items-center justify-center gap-2 border-none transition-all shadow-md">
                <FloppyDisk />
                Log In
              </Button>
            </Fieldset.Actions>
          </Fieldset>
        </Form>

        {/* Divider */}
        <div className="relative my-6 text-center text-xs text-gray-400">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
          <span className="relative bg-white px-3 font-semibold uppercase tracking-wider text-gray-400">Or continue with</span>
        </div>

        {/* Google Social Button */}
        <button
          type="button"
          onClick={signInWithGoogle}
          className="w-full btn bg-amber-50 hover:bg-amber-100 text-gray-800 border border-amber-200 font-semibold rounded-full py-2.5 flex items-center justify-center gap-2 transition-all shadow-xs"
        >
          <svg aria-label="Google logo" width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
            <g>
              <path d="m0 0H512V512H0" fill="#fff" />
              <path fill="#34a853" d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341" />
              <path fill="#4285f4" d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57" />
              <path fill="#fbbc02" d="m90 341a208 200 0 010-171l63 49q-12 37 0 73" />
              <path fill="#ea4335" d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55" />
            </g>
          </svg>
          Login with Google
        </button>

      </div>
    </div>
  );
}