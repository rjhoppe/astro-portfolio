import { describe, expect, test } from "vitest";

import UnderConstruction from "@components/UnderConstruction.astro";
import { render } from "@testing-library/react";

describe("UnderConstruction", () => {
  test("should render the under construction content", () => {
    const { container } = render(<UnderConstruction />);

    // Check for the main container
    const mainDiv = container.querySelector("div");
    expect(mainDiv).toHaveClass(
      "flex",
      "flex-col",
      "items-center",
      "justify-center",
      "h-full",
      "my-10",
    );

    // Check for the image
    const image = container.querySelector("img");
    expect(image).toHaveAttribute("src", "/img/restricted-area.png");
    expect(image).toHaveAttribute("alt", "Under Construction");
    expect(image).toHaveClass("w-64", "h-64");

    // Check for the heading
    const heading = container.querySelector("h1");
    expect(heading).toHaveTextContent("🚧 Under Construction 🚧");
    expect(heading).toHaveClass("text-4xl", "font-bold");

    // Check for the paragraph
    const paragraph = container.querySelector("p");
    expect(paragraph).toHaveTextContent(
      "This page is currently under construction. Please check back later! 🏗️",
    );
    expect(paragraph).toHaveClass("text-lg");
  });

  test("should have the correct structure", () => {
    const { container } = render(<UnderConstruction />);

    // Verify the component structure
    expect(container.querySelector("div")).toBeTruthy();
    expect(container.querySelector("img")).toBeTruthy();
    expect(container.querySelector("h1")).toBeTruthy();
    expect(container.querySelector("p")).toBeTruthy();

    // Verify the image is inside the main div
    const mainDiv = container.querySelector("div");
    const image = container.querySelector("img");
    expect(mainDiv).toContainElement(image);
  });
});
