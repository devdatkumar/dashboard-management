import SignOutButton from "@/components/signout";
import TaskForm from "@/components/task";

const User = () => {
  return (
    <>
      <SignOutButton />
      Welcome to the User Dashboard
      <TaskForm />
    </>
  );
};

export default User;
