"use client";

import {
  type FormEvent,

  useState,
} from "react";

import { HoursStepper } from "@/components/timesheets/hours-stepper";
// import type { WeeklyTimesheet } from "@/types/timesheet";
import type {
  TimesheetEntry,
  WeeklyTimesheet,
} from "@/types/timesheet";

type TimesheetEntryModalProps = {
  // isOpen: boolean;
  timesheetId: string;
  dayId: string
  entry: TimesheetEntry | null;
  onClose: () => void;
  onSaved: (
    updatedTimesheet: WeeklyTimesheet,
  ) => void;
};

type FormErrors = {
  projectName?: string;
  typeOfWork?: string;
  description?: string;
  hours?: string;
};

// type CreateEntryResponse = {
//   data: WeeklyTimesheet;
// };

export function TimesheetEntryModal({
  // isOpen,
  timesheetId,
  dayId,
  entry,
  onClose,
  onSaved,
}: TimesheetEntryModalProps) {
  const [projectName, setProjectName] =
    useState(entry?.projectName ?? "");

  const [typeOfWork, setTypeOfWork] =
    useState(entry?.typeOfWork ?? "Bug fixes");

  const [description, setDescription] =
    useState(entry?.description ?? "");

  const [hours, setHours] =
    useState(entry?.hours ?? 12);

  const [errors, setErrors] =
    useState<FormErrors>({});

  const [submitError, setSubmitError] =
    useState<string | null>(null);

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  // useEffect(() => {
  //   if (!isOpen) {
  //     return;
  //   }

  //   if (entry) {
  //     setProjectName(entry.projectName);
  //     setTypeOfWork(entry.typeOfWork);
  //     setDescription(entry.description);
  //     setHours(entry.hours);
  //   } else {
  //     setProjectName("");
  //     setTypeOfWork("Bug fixes");
  //     setDescription("");
  //     setHours(12);
  //   }

  //   setErrors({});
  //   setSubmitError(null);
  // }, [isOpen, dayId, entry]);

  function validateForm() {
    const nextErrors: FormErrors = {};

    if (!projectName.trim()) {
      nextErrors.projectName =
        "Please select a project.";
    }

    if (!typeOfWork.trim()) {
      nextErrors.typeOfWork =
        "Please select a type of work.";
    }

    if (!description.trim()) {
      nextErrors.description =
        "Task description is required.";
    } else if (description.trim().length < 3) {
      nextErrors.description =
        "Task description must be at least 3 characters.";
    }

    if (hours < 1 || hours > 24) {
      nextErrors.hours =
        "Hours must be between 1 and 24.";
    }

    setErrors(nextErrors);

    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    // if (!dayId) {
    //   return;
    // }

    if (!validateForm()) {
      return;
    }

    try {
      const url = isEditMode
        ? `/api/timesheets/${timesheetId}/entries/${entry.id}`
        : `/api/timesheets/${timesheetId}/entries`;

      const method = isEditMode
        ? "PATCH"
        : "POST";

      const payload = isEditMode
        ? {
          projectName,
          typeOfWork,
          description,
          hours,
        }
        : {
          dayId,
          projectName,
          typeOfWork,
          description,
          hours,
        };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = await response.json();

      if (!response.ok) {
        if (result.errors) {
          setErrors(result.errors);
        }

        throw new Error(
          result.message ??
          `Unable to ${isEditMode ? "update" : "add"
          } timesheet entry.`,
        );
      }

      onSaved(result.data);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Unable to add the entry. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  // if (!isOpen || !dayId) {
  //   return null;
  // }


  const isEditMode = entry !== null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-700/70 p-4"
      onMouseDown={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-entry-title"
        onMouseDown={(event) =>
          event.stopPropagation()
        }
        className="flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-gray-200 px-4 py-4">
          <h2
            id="add-entry-title"
            className="text-base font-semibold text-gray-900"
          >
            {isEditMode
              ? "Edit Entry"
              : "Add New Entry"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close modal"
            className="flex h-8 w-8 items-center justify-center rounded-md text-xl text-gray-400 transition hover:bg-gray-100 hover:text-gray-700 disabled:cursor-not-allowed"
          >
            ×
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="flex min-h-0 flex-1 flex-col"
        >
          <div className="overflow-y-auto px-4 py-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="project"
                  className="block text-sm font-medium text-gray-900"
                >
                  Select Project *{" "}
                  <span
                    aria-hidden="true"
                    className="text-gray-400"
                  >
                    ●
                  </span>
                </label>

                <select
                  id="project"
                  value={projectName}
                  disabled={isSubmitting}
                  aria-invalid={
                    Boolean(errors.projectName)
                  }
                  onChange={(event) => {
                    setProjectName(
                      event.target.value,
                    );

                    setErrors((current) => ({
                      ...current,
                      projectName: undefined,
                    }));
                  }}
                  className={`h-11 w-full rounded-lg border bg-white px-3 text-sm text-gray-600 outline-none focus:ring-2 ${errors.projectName
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                >
                  <option value="">
                    Project Name
                  </option>

                  <option value="Ticktock">
                    Ticktock
                  </option>

                  <option value="Website Redesign">
                    Website Redesign
                  </option>

                  <option value="Internal Dashboard">
                    Internal Dashboard
                  </option>
                </select>

                {errors.projectName && (
                  <p className="text-xs text-red-600">
                    {errors.projectName}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="work-type"
                  className="block text-sm font-medium text-gray-900"
                >
                  Type of Work *{" "}
                  <span
                    aria-hidden="true"
                    className="text-gray-400"
                  >
                    ●
                  </span>
                </label>

                <select
                  id="work-type"
                  value={typeOfWork}
                  disabled={isSubmitting}
                  onChange={(event) =>
                    setTypeOfWork(
                      event.target.value,
                    )
                  }
                  className="h-11 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm text-gray-600 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                >
                  <option value="Bug fixes">
                    Bug fixes
                  </option>

                  <option value="Development">
                    Development
                  </option>

                  <option value="Design">
                    Design
                  </option>

                  <option value="Testing">
                    Testing
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-900"
                >
                  Task description *
                </label>

                <textarea
                  id="description"
                  value={description}
                  disabled={isSubmitting}
                  aria-invalid={
                    Boolean(errors.description)
                  }
                  onChange={(event) => {
                    setDescription(
                      event.target.value,
                    );

                    setErrors((current) => ({
                      ...current,
                      description: undefined,
                    }));
                  }}
                  placeholder="Write text here ..."
                  rows={5}
                  className={`min-h-28 w-full resize-none rounded-lg border bg-white px-3 py-3 text-sm text-gray-900 outline-none placeholder:text-gray-400 focus:ring-2 ${errors.description
                    ? "border-red-400 focus:border-red-500 focus:ring-red-100"
                    : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                />

                {errors.description ? (
                  <p className="text-xs text-red-600">
                    {errors.description}
                  </p>
                ) : (
                  <p className="text-xs text-gray-500">
                    A note for extra info
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-900">
                  Hours *
                </label>

                <HoursStepper
                  value={hours}
                  onChange={setHours}
                />

                {errors.hours && (
                  <p className="text-xs text-red-600">
                    {errors.hours}
                  </p>
                )}
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
                >
                  {submitError}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 border-t border-gray-200 px-4 py-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="h-10 rounded-lg bg-[#1C64F2] px-4 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting
                ? isEditMode
                  ? "Saving..."
                  : "Adding..."
                : isEditMode
                  ? "Save changes"
                  : "Add entry"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="h-10 rounded-lg border border-gray-300 bg-white px-4 text-sm font-medium text-gray-900 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}