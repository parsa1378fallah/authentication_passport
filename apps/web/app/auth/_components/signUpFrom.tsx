"use client";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { signUp } from "@/lib/auth";
import SubmitButton from "@/components/ui/submit-button";
import { useActionState } from "react";
const SignUpForm = () => {
  const [state, action] = useActionState(signUp, undefined);
  return (
    <form action={action}>
      <div className="flex flex-col gap-2">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <div>
          <Label htmlFor="firstName">First Name</Label>
          <Input id="firstName" name="firstName" placeholder="parsa" />
          {state?.error?.firstName &&
            state.error.firstName.map((item) => (
              <p className="text-sm text-red-500" key={item}>
                {item}
                <br />
              </p>
            ))}
        </div>
        <div>
          <Label htmlFor="lastName">Last Name</Label>
          <Input id="lastName" name="lastName" placeholder="fallah" />
          {state?.error?.lastName &&
            state.error.lastName.map((item) => (
              <p className="text-sm text-red-500" key={item}>
                {item}
                <br />
              </p>
            ))}
        </div>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" placeholder="parsa@gmail.com" />
          {state?.error?.email && (
            <p className="text-sm text-red-500">{state.error.email}</p>
          )}
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" />
          {state?.error?.password && (
            <p className="text-sm text-red-500">{state.error.password}</p>
          )}
        </div>
        <SubmitButton>Sign Up</SubmitButton>
      </div>
    </form>
  );
};
export default SignUpForm;
