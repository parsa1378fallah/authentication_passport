import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  console.log(session);
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black"></div>
  );
}
