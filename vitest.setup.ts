import "@testing-library/jest-dom";

import { vi } from "vitest";

/**
 * Provide a mock of our env module during testing.
 * We could look into using a .env file for this as well.
 */
vi.mock("~/env.ts", () => ({
  env: {
    apiUrl: "http://www.example.com",
    nodeEnv: "TEST",
  },
}));
