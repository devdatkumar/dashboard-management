"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SignupForm from "./signup-form";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Tabs defaultValue="signup" className="w-96">
        <div className="inline-flex items-center justify-center rounded-lg bg-muted text-muted-foreground w-full">
          <Button asChild variant={"ghost"} className="w-1/2 h-8">
            <Link href="/signin">Sign in</Link>
          </Button>
          <Button variant={"outline"} className="w-1/2 text-foreground h-8">
            Sign up
          </Button>
        </div>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign up</CardTitle>
            </CardHeader>
            <CardContent>
              <SignupForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
