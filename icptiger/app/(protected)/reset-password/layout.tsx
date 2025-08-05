import { redirect } from "next/navigation";
import { isUserAuthenticated } from "@/app/actions/auth";

export default async function ProtectedPage({ children }: { children: React.ReactNode }) {
  const user = await isUserAuthenticated();

  if (!user) {
    return redirect("/sign-in");
  }

  return <main className="flex-1 flex justify-center items-center w-full p-4">{children}</main>;
}
