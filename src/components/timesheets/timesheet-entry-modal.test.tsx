import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { TimesheetEntryModal } from "@/components/timesheets/timesheet-entry-modal";

describe("TimesheetEntryModal", () => {
  it("shows validation errors for missing required fields", async () => {
    const user = userEvent.setup();

    render(
      <TimesheetEntryModal
        timesheetId="week-4"
        dayId="2024-01-21"
        entry={null}
        onClose={vi.fn()}
        onSaved={vi.fn()}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Add entry",
      }),
    );

    expect(
      screen.getByText(
        "Please select a project.",
      ),
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Task description is required.",
      ),
    ).toBeInTheDocument();
  });
});