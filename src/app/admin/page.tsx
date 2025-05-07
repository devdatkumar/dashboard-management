import SignOutButton from "@/components/signout";
import TaskForm from "@/components/task";

const Admin = () => {
  return (
    <>
      <SignOutButton />
      Welcome to the Admin Dashboard!
      <TaskForm />
    </>
  );
};

export default Admin;
