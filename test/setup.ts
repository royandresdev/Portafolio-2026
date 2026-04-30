import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mock de IntersectionObserver ya que no está disponible en JSDOM
// Útil para componentes con animaciones on-scroll
const IntersectionObserverMock = vi.fn(function () {
  return {
    disconnect: vi.fn(),
    observe: vi.fn(),
    takeRecords: vi.fn(),
    unobserve: vi.fn(),
  };
});

vi.stubGlobal("IntersectionObserver", IntersectionObserverMock);
