import Image from "next/image";
import ReviewCard from "@/components/review-card";
import SignUpForm from "@/components/signup-card";

const SignUp = async () => {
  return (
    <div className="flex h-screen flex-row">
      <div className="flex flex-2 flex-col items-start justify-center">
        <div className="flex h-full w-full items-center justify-center">
          <SignUpForm />
        </div>
      </div>
      <div className="flex flex-3 flex-col justify-center bg-card">
        <div className="flex flex-1 items-center justify-center">
          <ReviewCard />
        </div>
        <div className="flex items-end justify-end min-h-[400px]">
          <Image
            alt="Image"
            width={650}
            src="/dashboard.webp"
            height={650}
          />
        </div>
      </div>
    </div>
  );
};
export default SignUp;
