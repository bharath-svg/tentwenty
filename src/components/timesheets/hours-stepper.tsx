"use client";

type HoursStepperProps = {
  value: number;
  onChange: (value: number) => void;
};

export function HoursStepper({
  value,
  onChange,
}: HoursStepperProps) {
  function decrease() {
    onChange(Math.max(1, value - 1));
  }

  function increase() {
    onChange(Math.min(24, value + 1));
  }

  return (
    <div className="inline-flex overflow-hidden rounded-lg border border-gray-300 bg-white">
      <button
        type="button"
        onClick={decrease}
        aria-label="Decrease hours"
        className="flex h-10 w-10 items-center justify-center border-r border-gray-300 text-lg text-gray-700 hover:bg-gray-50"
      >
        −
      </button>

      <div className="flex h-10 min-w-12 items-center justify-center px-3 text-sm text-gray-600">
        {value}
      </div>

      <button
        type="button"
        onClick={increase}
        aria-label="Increase hours"
        className="flex h-10 w-10 items-center justify-center border-l border-gray-300 text-lg text-gray-700 hover:bg-gray-50"
      >
        +
      </button>
    </div>
  );
}