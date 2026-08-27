// Persistent on every page, never a dismissible modal -- design.md ("UI rules") and
// architecture.md ("Cross-cutting: SyntheticDataNotice").

import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SyntheticDataNotice } from "./SyntheticDataNotice";

describe("SyntheticDataNotice", () => {
  it("renders a synthetic-data disclosure with no way to dismiss it", () => {
    render(<SyntheticDataNotice />);
    expect(screen.getByText(/synthetic/i)).toBeInTheDocument();
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });
});
