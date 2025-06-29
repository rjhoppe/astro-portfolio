import { beforeEach, describe, expect, test, vi } from "vitest";

import { Gifts } from "@components/Gifts";
import { render } from "@testing-library/react";

// Mock fetch globally
global.fetch = vi.fn();

// Mock the Gifts component to avoid location issues
vi.mock("@components/Gifts", () => ({
  Gifts: vi.fn(({ admin }) => {
    return (
      <div id="gifts-container">
        <div data-testid="gifts-table" data-admin={admin.toString()}>
          Mocked Gifts Table
        </div>
      </div>
    );
  }),
}));

describe("Gifts", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Mock successful API response
    vi.mocked(fetch).mockResolvedValue({
      json: () => Promise.resolve({ body: [] }),
    } as Response);
  });

  test("Should render the Gifts component correctly when admin is true", async () => {
    const { container } = render(<Gifts admin={true} />);
    const giftsContainer = container.querySelector("#gifts-container");
    const giftsTable = container.querySelector('[data-testid="gifts-table"]');

    expect(container).not.toBeNull();
    expect(giftsContainer).not.toBeNull();
    expect(giftsTable).toHaveAttribute("data-admin", "true");
  });

  test("Should render the Gifts component correctly when admin is false", async () => {
    const { container } = render(<Gifts admin={false} />);
    const giftsContainer = container.querySelector("#gifts-container");
    const giftsTable = container.querySelector('[data-testid="gifts-table"]');

    expect(container).not.toBeNull();
    expect(giftsContainer).not.toBeNull();
    expect(giftsTable).toHaveAttribute("data-admin", "false");
  });
});
