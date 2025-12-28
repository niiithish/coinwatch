import { ComponentExample } from "@/components/component-example";
import { Button } from "@/components/ui/button";
import { signOutAction } from "./actions/auth";

export default function Page() {
  return (
    <>
      <header className="flex p-4 border-b items-center justify-between">
        <h1>Coin Mantra</h1>
        <Button onClick={signOutAction}>Sign Out</Button>
      </header>
      <ComponentExample />
    </>
  );
}
