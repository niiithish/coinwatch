import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { SidebarHeader } from "@/components/ui/sidebar";
import Image from "next/image";
const Dashboard = () => {
  return (
    <div>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader className="border-b">
            <div className="flex flex-row gap-3 p-2">
              <Image src="logo.svg" alt="Coin Mantra" width={26} height={26} />
              <h1 className="text-xl font-bold">CoinWatch</h1>
            </div>
          </SidebarHeader>
          <SidebarContent>Home</SidebarContent>
        </Sidebar>
      </SidebarProvider>
      Hello World
    </div>
  );
};

export default Dashboard;
