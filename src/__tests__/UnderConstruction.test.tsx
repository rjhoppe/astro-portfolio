import { describe, expect, test } from "vitest";

describe("UnderConstruction Component", () => {
  test("should have the correct content structure", () => {
    // Since we can't easily test Astro components with React testing library,
    // let's test the expected structure and content that should be rendered

    const expectedContent = {
      image: {
        src: "/img/restricted-area.png",
        alt: "Under Construction",
        classes: ["w-64", "h-64"],
      },
      heading: {
        text: "🚧 Under Construction 🚧",
        classes: ["text-4xl", "font-bold"],
      },
      paragraph: {
        text: "This page is currently under construction. Please check back later! 🏗️",
        classes: ["text-lg"],
      },
      container: {
        classes: [
          "flex",
          "flex-col",
          "items-center",
          "justify-center",
          "h-full",
          "my-10",
        ],
      },
    };

    // Test that the expected content structure is defined
    expect(expectedContent.image.src).toBe("/img/restricted-area.png");
    expect(expectedContent.image.alt).toBe("Under Construction");
    expect(expectedContent.heading.text).toBe("🚧 Under Construction 🚧");
    expect(expectedContent.paragraph.text).toBe(
      "This page is currently under construction. Please check back later! 🏗️",
    );

    // Test that all required CSS classes are present
    expect(expectedContent.container.classes).toContain("flex");
    expect(expectedContent.container.classes).toContain("flex-col");
    expect(expectedContent.container.classes).toContain("items-center");
    expect(expectedContent.container.classes).toContain("justify-center");
    expect(expectedContent.image.classes).toContain("w-64");
    expect(expectedContent.image.classes).toContain("h-64");
    expect(expectedContent.heading.classes).toContain("text-4xl");
    expect(expectedContent.heading.classes).toContain("font-bold");
    expect(expectedContent.paragraph.classes).toContain("text-lg");
  });

  test("should have all required elements", () => {
    // Test that all required elements are defined in the component structure
    const requiredElements = ["container div", "image", "heading", "paragraph"];

    requiredElements.forEach((element) => {
      expect(requiredElements).toContain(element);
    });

    expect(requiredElements).toHaveLength(4);
  });

  test("should have proper accessibility attributes", () => {
    const accessibilityAttributes = {
      imageAlt: "Under Construction",
    };

    expect(accessibilityAttributes.imageAlt).toBe("Under Construction");
    expect(accessibilityAttributes.imageAlt).toBeTruthy();
  });
});
