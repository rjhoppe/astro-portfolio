import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";

import GiftsTable from "@components/GiftsTable";

const mockGifts = [
  {
    id: 1,
    name: "Kindle",
    bought: "No",
    assignee: "Justin",
    link: "http://a.co/hundo",
    notes: "Paperwhite",
  },
  {
    id: 2,
    name: "TV",
    bought: "Yes",
    assignee: "Rick",
    link: "http://a.co/hundo",
    notes: "OLED",
  },
];

describe("GiftsTable", () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ body: mockGifts }),
      }),
    ) as any;
  });

  it("should fetch and display gifts", async () => {
    render(<GiftsTable admin={true} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getByText("Kindle")).toBeInTheDocument();
    expect(screen.getByText("Paperwhite")).toBeInTheDocument();
    expect(screen.getByText("TV")).toBeInTheDocument();
    expect(screen.getByText("OLED")).toBeInTheDocument();
  });

  it("should show a session expired alert after 3 hours", async () => {
    // GIVEN: A mocked global alert and the component is rendered
    const startTime = Date.now();
    const dateSpy = vi.spyOn(Date, "now").mockImplementation(() => startTime);
    render(<GiftsTable admin={true} />);
    await waitFor(() => {
      expect(screen.getByText("Kindle")).toBeInTheDocument();
    });

    // WHEN: A user makes a change
    const firstCheckbox = screen.getAllByRole(
      "checkbox",
    )[0] as HTMLInputElement;
    fireEvent.click(firstCheckbox);
    const updateButton = await screen.findByRole("button", {
      name: /Update \d+ Record/,
    });

    // AND: 3 hours pass by mocking the time
    const threeHoursLater = startTime + 3 * 60 * 60 * 1000 + 1;
    dateSpy.mockImplementation(() => threeHoursLater);

    // AND: The user tries to submit
    fireEvent.click(updateButton);

    // THEN: An alert should be shown
    expect(
      screen.getByText(
        "session expired, you must refresh the page and reapply your changes.",
      ),
    ).toBeInTheDocument();

    // AND: The update API should not be called
    const fetchCalls = (global.fetch as vi.Mock).mock.calls;
    const batchUpdateCall = fetchCalls.find(
      (call: any[]) => call[0] === "/api/gifts/batch-update",
    );
    expect(batchUpdateCall).toBeUndefined();

    // Cleanup
    dateSpy.mockRestore();
  });
});
