export function DashboardHeader() {
  return (
    <header className="border-b border-gray-100 bg-white">
      <div className="flex h-16 items-center justify-between px-5 sm:px-8 lg:px-10">
        <div className="flex items-center gap-8">
          <span className="text-xl font-semibold text-gray-900">
            ticktock
          </span>

          <span className="hidden text-sm font-medium text-gray-700 sm:inline">
            Timesheets
          </span>
        </div>

        <button
          type="button"
          className="text-sm text-gray-600 transition hover:text-gray-900"
        >
          John Doe⌄
        </button>
      </div>
    </header>
  );
}