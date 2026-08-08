import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { StatusBadge } from "@/components/timesheets/status-badge";

describe("StatusBadge", () => {
  it("renders completed status", () => {
    render(<StatusBadge status="completed" />);

    expect(
      screen.getByText("completed"),
    ).toBeInTheDocument();
  });

  it("renders incomplete status", () => {
    render(<StatusBadge status="incomplete" />);

    expect(
      screen.getByText("incomplete"),
    ).toBeInTheDocument();
  });

  it("renders missing status", () => {
    render(<StatusBadge status="missing" />);

    expect(
      screen.getByText("missing"),
    ).toBeInTheDocument();
  });
});