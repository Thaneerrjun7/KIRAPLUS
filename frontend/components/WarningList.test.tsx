// Ordered warning list -- docs/API-CONTRACT.md §3: "most severe first and may be empty", and
// "the UI must handle an unknown code by rendering title and detail generically rather than
// crashing" -- this component never switches on `code`, so an unrecognized one is handled for
// free by simply rendering whatever title/detail the backend sent.

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { WarningList } from "./WarningList";

describe("WarningList", () => {
  it("renders each warning's title and detail, in the given order", () => {
    render(
      <WarningList
        warnings={[
          {
            code: "OVERCOMMITTED",
            level: "red",
            title: "You are overcommitted",
            detail: "95% of your income is already committed.",
            lever: "",
          },
          {
            code: "MULTI_COMMIT",
            level: "amber",
            title: "Many active commitments",
            detail: "5 active commitments totalling RM800 a month.",
            lever: "",
          },
        ]}
      />
    );

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("95% of your income is already committed.");
    expect(items[1]).toHaveTextContent("5 active commitments totalling RM800 a month.");
  });

  it("renders an unrecognized warning code the same way, without crashing", () => {
    render(
      <WarningList
        warnings={[
          {
            // @ts-expect-error -- deliberately an unknown code, per §3's forward-compat rule
            code: "SOME_FUTURE_CODE",
            level: "amber",
            title: "A brand new warning",
            detail: "With its own detail text.",
            lever: "",
          },
        ]}
      />
    );

    expect(screen.getByText("A brand new warning")).toBeInTheDocument();
    expect(screen.getByText("With its own detail text.")).toBeInTheDocument();
  });

  it("shows a no-warnings message rather than an empty list for a clean profile", () => {
    render(<WarningList warnings={[]} />);
    expect(screen.getByText(/no warnings/i)).toBeInTheDocument();
  });
});
