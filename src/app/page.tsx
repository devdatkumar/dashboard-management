import { Button } from "@/components/ui/button";
import { userSeed } from "@/db/userseed";

export default async function Home() {
  await userSeed();

  return (
    <div>
      <Button>Click!</Button>
    </div>
  );
}
