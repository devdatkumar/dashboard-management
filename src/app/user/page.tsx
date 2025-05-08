import SignOutButton from "@/components/signout";
import TaskForm from "@/components/task";
import UserTasks from "@/components/usertasks";

const User = () => {
  return (
    <>
      <div className="flex justify-between h-14 items-center px-2 border-b">
        User Dashboard!
        <TaskForm />
        <SignOutButton />
      </div>
      <div>
        <UserTasks />
      </div>
    </>
  );
};

export default User;
