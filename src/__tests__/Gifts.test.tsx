import { beforeEach, describe, expect, test, vi } from "vitest";

import { Gifts } from "@components/Gifts";
import { render } from "@testing-library/react";

// Mock fetch globally
global.fetch = vi.fn();

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
