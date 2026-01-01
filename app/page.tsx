import { getSession } from "better-auth/api";
import { redirect } from "next/navigation";

const Page = async () => {
  const session = await getSession();
  if (!session) {
    redirect('/login');
  }
  redirect('/dashboard');
};

export default Page;
