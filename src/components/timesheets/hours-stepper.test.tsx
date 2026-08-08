import {
  render,
  screen,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { HoursStepper } from "@/components/timesheets/hours-stepper";

describe("HoursStepper", () => {
  it("increases hours", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <HoursStepper
        value={4}
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Increase hours",
      }),
    );

    expect(onChange).toHaveBeenCalledWith(5);
  });

  it("decreases hours", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <HoursStepper
        value={4}
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Decrease hours",
      }),
    );

    expect(onChange).toHaveBeenCalledWith(3);
  });

  it("does not decrease below one hour", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(
      <HoursStepper
        value={1}
        onChange={onChange}
      />,
    );

    await user.click(
      screen.getByRole("button", {
        name: "Decrease hours",
      }),
    );

    expect(onChange).toHaveBeenCalledWith(1);
  });
});