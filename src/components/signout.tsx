"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button"; // Assuming you have a Button UI component

const SignOutButton = () => {
  const router = useRouter();

  const handleSignOut = async () => {
    await fetch("/api/auth/signout", {
      method: "POST",
    });

    router.push("/signin");
  };

  return (
    <Button onClick={handleSignOut} variant="default">
      Sign Out
    </Button>
  );
};

export default SignOutButton;
