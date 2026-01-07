import { getSession } from "@/lib/session";
import Link from "next/link";
import { signOut } from "@/lib/actios/signout";
const SignInButton = async () => {
  const session = await getSession();
  return (
    <div className="flex items-center gap-2 ml-auto">
      {!session || !session.user ? (
        <>
          <Link href="/auth/sign-in">Sign In</Link>
          <Link href="/auth/sign-up">Sign Up</Link>
        </>
      ) : (
        <>
          <p>{`${session.user.firstName}  ${session.user.lastName}`}</p>
          <form action={signOut}>
            <button>Sign Out</button>
          </form>
        </>
      )}
    </div>
  );
};
export default SignInButton;
