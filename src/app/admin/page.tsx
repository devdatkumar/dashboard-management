"use client";

import AdminTask from "@/components/admintasks";
import SignOutButton from "@/components/signout";

const Admin = () => {
  return (
    <>
      <div className="flex justify-between h-14 items-center px-2 border-b">
        Admin Dashboard!
        <SignOutButton />
      </div>
      <div>
        <AdminTask />
      </div>
    </>
  );
};

export default Admin;
