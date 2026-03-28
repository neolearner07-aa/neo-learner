import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import Card from "@/components/ui/card";
import Badge from "@/components/ui/badge";

import LogoutButton from "./logout-button";

export default async function DashboardPage() {
  const session = await getServerSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-full max-w-lg space-y-4 text-center">
        <h1 className="text-2xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-gray-300">
          Welcome, {session.user.email}
        </p>

        <Badge>Authenticated User</Badge>

        <div className="pt-4">
          <LogoutButton />
        </div>
      </Card>
    </div>
  );
}