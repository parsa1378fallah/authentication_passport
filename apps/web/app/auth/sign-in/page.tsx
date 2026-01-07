import Link from "next/link";
import SignInForm from "../_components/signInForm";
const SignInPage = () => {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-96 flex flex-col justify-center items-center">
      <h1 className="text-center text-2xl font-bold mb-4">Sign In Page</h1>
      <SignInForm />
      <div className="flex justify-between text-sm">
        <p>do not have an account ?</p>
        <Link className="underline" href={"/auth/sign-up"}>
          Sign Up
        </Link>
      </div>
    </div>
  );
};
export default SignInPage;
