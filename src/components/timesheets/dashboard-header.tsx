import Link from "next/link";

import { auth, signOut } from "@/auth";

export async function DashboardHeader() {
  const session = await auth();

  const userName =
    session?.user?.name ??
    session?.user?.email ??
    "User";

  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="flex h-16 items-center justify-between px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-8">
          <Link
            href="/dashboard"
            className="text-xl font-semibold text-gray-900"
          >
            ticktock
          </Link>

          <Link
            href="/dashboard"
            className="hidden text-sm font-medium text-gray-700 transition hover:text-gray-900 sm:inline"
          >
            Timesheets
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <span className="hidden text-sm text-gray-600 sm:inline">
            {userName}
          </span>

          <form
            action={async () => {
              "use server";

              await signOut({
                redirectTo: "/login",
              });
            }}
          >
            <button
              type="submit"
              className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
            >
              Sign out
            </button>
          </form>
        </div>
      </div>
    </header>
  );
}