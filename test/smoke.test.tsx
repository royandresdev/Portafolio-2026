import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { DeployButton } from "@/components/deploy-button";

describe("Smoke Test: DeployButton", () => {
  it("debe renderizar el botón de deploy correctamente", () => {
    render(<DeployButton />);
    const linkElement = screen.getByRole("link");
    expect(linkElement).toBeInTheDocument();
    expect(screen.getByText(/Deploy to Vercel/i)).toBeInTheDocument();
  });
});
