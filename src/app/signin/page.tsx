"use client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SigninForm from "./signin-form";

export default function Page() {
  return (
    <div className="flex h-screen w-full items-center justify-center px-4">
      <Tabs defaultValue="signin" className="w-96">
        <div className="inline-flex items-center justify-center rounded-lg bg-muted text-muted-foreground w-full">
          <Button variant={"outline"} className="w-1/2 text-foreground h-8">
            Sign in
          </Button>
          <Button asChild variant={"ghost"} className="w-1/2 h-8">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Sign in</CardTitle>
            </CardHeader>
            <CardContent>
              <SigninForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
