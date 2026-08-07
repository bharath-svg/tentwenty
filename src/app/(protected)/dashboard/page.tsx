import { DashboardHeader } from "@/components/timesheets/dashboard-header";
import { TimesheetDashboard } from "@/components/timesheets/timesheet-dashboard";

export default function DashboardPage() {
  return (
    <div className="min-h-dvh bg-gray-50">
      <DashboardHeader />

      <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <section className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
          <h1 className="text-2xl font-semibold text-gray-900">
            Your Timesheets
          </h1>

          <TimesheetDashboard />
        </section>

        <footer className="mt-4 rounded-xl border border-gray-200 bg-white px-5 py-7 text-center text-xs text-gray-500 shadow-sm">
          © 2026 tentwenty. All rights reserved.
        </footer>
      </main>
    </div>
  );
}