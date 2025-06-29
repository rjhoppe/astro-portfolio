import { beforeEach, describe, expect, test, vi } from "vitest";

import { Gifts } from "@components/Gifts";
import { render } from "@testing-library/react";

// Mock fetch globally
global.fetch = vi.fn();

// Mock import.meta.env to provide the gifts password
vi.mock("import.meta", () => ({
  env: {
    PUBLIC_GIFTS_PASSWORD: "test-password",
  },
}));

// Mock window.location to prevent redirect issues
const mockLocation = {
  search: "?password=test-password",
  href: "",
};

Object.defineProperty(window, "location", {
  value: mockLocation,
  writable: true,
  configurable: true,
});

describe("Gifts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset location mock
    mockLocation.href = "";
    // Mock successful API response
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve({ body: [] }),
    } as Response);
  });

  test("Should render the Gifts component correctly when admin is true", async () => {
    const { container } = render(<Gifts admin={true} />);
    const giftsContainer = container.querySelector("#gifts-container");

    expect(container).not.toBeNull();
    expect(giftsContainer).not.toBeNull();
  });

  test("Should render the Gifts component correctly when admin is false", async () => {
    const { container } = render(<Gifts admin={false} />);
    const giftsContainer = container.querySelector("#gifts-container");

    expect(container).not.toBeNull();
    expect(giftsContainer).not.toBeNull();
  });
});
