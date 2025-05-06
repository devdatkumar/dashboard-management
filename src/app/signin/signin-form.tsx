"use client";

import React, { useState } from "react";
import Form from "next/form";
import {
  CircleAlert,
  Eye,
  EyeClosed,
  LogIn,
  UserRoundCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signinSchema } from "@/lib/types/auth-schema";

type FieldErrorType = {
  email?: string[] | undefined;
  password?: string[] | undefined;
};

export default function SigninForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ email: "", password: "" });
  const [fieldError, setFieldError] = useState<FieldErrorType | undefined>({});
  const [state, setState] = useState({ success: "", failed: "" });

  const handleAction = async (formData: FormData) => {
    const validationResult = signinSchema.safeParse(
      Object.fromEntries(formData)
    );

    setFieldError({});
    setState({ success: "", failed: "" });

    if (!validationResult.success) {
      setFieldError(validationResult.error.flatten().fieldErrors);
      setUser({
        email: formData.get("email")?.toString() ?? "",
        password: formData.get("password")?.toString() ?? "",
      });
      return;
    }

    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const responseData = await res.json();
        setState({
          success: "",
          failed: responseData.message || "Signin failed",
        });

        return;
      }

      setState({
        success: "Signin successful!",
        failed: "",
      });

      setUser({ email: "", password: "" });

      // optionally, redirect or show a success message here
    } catch (err) {
      console.error("Signin failed", err);
    }

    setUser({
      email: "",
      password: "",
    });
  };

  return (
    <Form action={handleAction}>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="example@email.com"
            defaultValue={user.email}
            required
          />
          {fieldError?.email && (
            <ul className="text-red-500 text-sm">
              {fieldError.email.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          )}
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="flex gap-x-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="********"
              autoComplete="current-password"
              defaultValue={user.password}
              required
            />
            <Button
              className="rounded-xl"
              type="button"
              variant={"outline"}
              onClick={() => {
                setShowPassword((prev) => !prev);
              }}
              aria-label={showPassword ? "Hide password" : "Show password"}
              aria-pressed={showPassword}
            >
              {showPassword ? <Eye /> : <EyeClosed />}
            </Button>
          </div>
          <div>
            {fieldError?.password && (
              <ol className="text-red-500 text-sm">
                Password must contain:
                {fieldError.password.map((error, index) => (
                  <li key={index} className="pl-2">
                    - {error}
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
        {state?.failed && (
          <div className="bg-destructive/20 p-3 rounded-md flex items-center gap-x-2 text-sm text-red-500 border">
            <CircleAlert />
            <p>{state.failed}</p>
          </div>
        )}
        {state?.success && (
          <div className="bg-green-500/20 p-3 rounded-md flex items-center gap-x-2 text-sm text-green-500 border">
            <UserRoundCheck />
            <p>{state.success}</p>
          </div>
        )}
        <Button type="submit">
          <LogIn />
          Sign in
        </Button>
      </div>
    </Form>
  );
}
