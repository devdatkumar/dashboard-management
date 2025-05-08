"use client";

import React, { useState } from "react";
import Form from "next/form";
import { Eye, EyeClosed, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signupSchema } from "@/lib/types/auth-schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

type FieldErrorType = {
  email?: string[] | undefined;
  password?: string[] | undefined;
  role?: string[] | undefined;
};

export default function SignupForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState({ email: "", password: "", role: "USER" });
  const [fieldError, setFieldError] = useState<FieldErrorType | undefined>({});

  const handleAction = async (formData: FormData) => {
    const validationResult = signupSchema.safeParse(
      Object.fromEntries(formData)
    );

    setFieldError({});

    if (!validationResult.success) {
      setFieldError(validationResult.error.flatten().fieldErrors);
      setUser({
        email: formData.get("email")?.toString() ?? "",
        password: formData.get("password")?.toString() ?? "",
        role: user.role,
      });
      return;
    }

    formData.set("role", user.role);
    const data = Object.fromEntries(formData);

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const response = await res.json();
      if (!res.ok) {
        toast.error(`${response.message}`);
        setFieldError(response.errors);
        return;
      }

      toast.success(`${response.message}`);

      router.push("/user");

      setUser({ email: "", password: "", role: "USER" });
    } catch (err) {
      console.error("Signup failed", err);
    }

    setUser({
      email: "",
      password: "",
      role: "USER",
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
        <div className="grid gap-2">
          <Label htmlFor="email">Role</Label>
          <Select
            name="role"
            value={user.role}
            onValueChange={(value) => setUser({ ...user, role: value })}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select User Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USER">User</SelectItem>
              <SelectItem value="ADMIN">Admin</SelectItem>
            </SelectContent>
          </Select>
          {fieldError?.role && (
            <p className="text-red-500 text-sm mt-1">{fieldError.role}</p>
          )}
        </div>
        <Button type="submit">
          <LogIn />
          Sign up
        </Button>
      </div>
    </Form>
  );
}
