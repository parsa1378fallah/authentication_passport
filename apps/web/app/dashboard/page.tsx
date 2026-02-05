import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

const DashbordPage = async () => {
  const session = await getSession();
  if (!session || !session.user) redirect("/auth/sign-in");

  console.log({ session });
  return <div>dashboard</div>;
};
export default DashbordPage;
