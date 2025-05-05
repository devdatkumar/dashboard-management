import { Button } from "@/components/ui/button";
import { userSeed } from "@/db/userseed";
import { taskSeed } from "@/db/taskseed";

export default function Home() {
  userSeed();
  taskSeed();

  return (
    <div>
      <Button>Click!</Button>
    </div>
  );
}
