import { render } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import { Gifts } from "@components/Gifts";

describe("Gifts", () => {
  test("Should render the Gifts component correctly when admin is true", async () => {
    const { container } = render(<Gifts admin={true} />);
    const giftsContainer = container.querySelector("#gifts-container");

    expect(container).not.toBeNull();
    expect(giftsContainer).not.toBeNull();
  });
});
