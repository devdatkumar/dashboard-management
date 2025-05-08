import SignOutButton from "@/components/signout";
import UserTasks from "@/components/usertasks";

const User = () => {
  return (
    <>
      <div className="flex justify-between h-14 items-center px-2 border-b">
        User Dashboard!
        <SignOutButton />
      </div>
      <div>
        <UserTasks />
      </div>
    </>
  );
};

export default User;
