"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import SubmitButton from "@/components/ui/submit-button";
import { useActionState } from "react";
import { signIn } from "@/lib/auth";

const SignInForm = () => {
  const [state, action] = useActionState(signIn, undefined);
  return (
    <form action={action}>
      <div className="flex flex-col gap-2 w-64">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <div>
          <Label>Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="parsa@gmail.com"
            type="email"
          />
          {state?.error?.email && (
            <p className="text-sm text-red-500">{state.error.email}</p>
          )}
        </div>
        <div>
          <Label>Password</Label>
          <Input id="password" name="password" />
          {state?.error?.password && (
            <p className="text-sm text-red-500">{state.error.password}</p>
          )}
        </div>
        <SubmitButton>Sign In</SubmitButton>
      </div>
    </form>
  );
};
export default SignInForm;
