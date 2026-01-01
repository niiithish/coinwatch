import Image from "next/image";
import { redirect } from "next/navigation";
import LoginCard from "@/components/login-card";
import ReviewCard from "@/components/review-card";
import { getSession } from "@/lib/auth";

const Login = async () => {
  const session = await getSession();
  if (session) {
    redirect("/dashboard");
  }
  return (
    <div className="flex h-screen flex-row">
      <div className="flex flex-2 flex-col items-start justify-center">
        <header className="mt-6 ml-6 flex gap-2">
          <Image alt="logo" height={30} src="/logo.svg" width={30} />
          <h1 className="font-bold text-xl">CoinWatch</h1>
        </header>
        <div className="flex h-full w-full items-center justify-center">
          <LoginCard />
        </div>
      </div>
      <div className="flex flex-3 flex-col justify-center bg-card">
        <div className="flex h-full items-center items-center justify-center">
          <ReviewCard />
        </div>
        <div className="flex items-end justify-end">
          <Image alt="Image" height={560} src="/dashboard.webp" width={480} />
        </div>
      </div>
    </div>
  );
};
export default Login;
