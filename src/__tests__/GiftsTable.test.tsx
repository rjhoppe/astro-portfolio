import { beforeEach, describe, expect, test, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";

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
    // Mock fetch before each test
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ body: mockGifts }),
      }),
    ) as any;
  });

  test("should fetch and display gifts", async () => {
    // Act
    render(<GiftsTable admin={true} />);

    // Assert
    // Check for loading state first
    expect(screen.getByText("Loading...")).toBeInTheDocument();

    // Wait for the gifts to be displayed
    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // Check if the gift data is rendered
    expect(screen.getByText("Kindle")).toBeInTheDocument();
    expect(screen.getByText("Paperwhite")).toBeInTheDocument();
    expect(screen.getByText("TV")).toBeInTheDocument();
    expect(screen.getByText("OLED")).toBeInTheDocument();
  });
});
