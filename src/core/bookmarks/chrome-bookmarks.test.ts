import { describe, expect, it, vi } from "vitest";

import { insertBookmarksDto } from "./chrome-bookmarks";

function setup() {
  let id = 100;
  const nextId = () => (id++).toString();

  return {
    createFn: vi.fn((args) => {
      return /error/i.test(args.title)
        ? Promise.reject("Intentionally failed for testing")
        : Promise.resolve({ id: nextId(), ...args });
    }),
  };
}

describe("create-bookmarks", () => {
  describe("insertBookmarksDto", () => {
    afterEach(vi.resetAllMocks);

    it("creates a single bookmark", async () => {
      const { createFn } = setup();
      const { created, errors } = await insertBookmarksDto({
        parentId: "1",
        bookmarks: [
          { title: "Single Bookmark", url: "http://www.example.com" },
        ],
        createFn,
      });
      expect(errors.length).toBe(0);
      expect(created.length).toBe(1);
      expect(created).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "100", parentId: "1" }),
        ])
      );
    });

    it("creates a single folder with a single bookmark", async () => {
      const { createFn } = setup();
      const { created, errors } = await insertBookmarksDto({
        parentId: "1",
        bookmarks: [
          {
            title: "Folder 1",
            children: [{ title: "Link 1", url: "http://www.example.com" }],
          },
        ],
        createFn,
      });
      expect(errors.length).toBe(0);
      expect(created.length).toBe(2);
      expect(created).toEqual(
        expect.arrayContaining([
          expect.objectContaining({ id: "100", parentId: "1" }),
          expect.objectContaining({ id: "101", parentId: "100" }),
        ])
      );
    });

    it("creates an array of bookmarks with different levels of children", async () => {
      const { createFn } = setup();
      const { created, errors } = await insertBookmarksDto({
        parentId: "1",
        bookmarks: [
          {
            title: "Link 1",
            url: "http://www.example.com",
          },
          {
            title: "Folder 1",
            children: [
              {
                title: "Folder 2",
                children: [{ title: "Link 2", url: "http://www.example.com" }],
              },
            ],
          },
          {
            title: "Folder 3",
            children: [{ title: "Link 3", url: "http://www.example.com" }],
          },
        ],
        createFn,
      });
      expect(errors.length).toBe(0);
      expect(created.length).toBe(6);
      expect(created).toMatchInlineSnapshot(`
        [
          {
            "id": "100",
            "parentId": "1",
            "success": true,
            "title": "Link 1",
            "url": "http://www.example.com",
          },
          {
            "id": "101",
            "parentId": "1",
            "success": true,
            "title": "Folder 1",
            "url": undefined,
          },
          {
            "id": "103",
            "parentId": "101",
            "success": true,
            "title": "Folder 2",
            "url": undefined,
          },
          {
            "id": "105",
            "parentId": "103",
            "success": true,
            "title": "Link 2",
            "url": "http://www.example.com",
          },
          {
            "id": "102",
            "parentId": "1",
            "success": true,
            "title": "Folder 3",
            "url": undefined,
          },
          {
            "id": "104",
            "parentId": "102",
            "success": true,
            "title": "Link 3",
            "url": "http://www.example.com",
          },
        ]
      `);
    });

    it("allows for partial success within a tree", async () => {
      const { createFn } = setup();
      const { created, errors } = await insertBookmarksDto({
        parentId: "1",
        bookmarks: [
          {
            title: "Folder 1",
            children: [
              { title: "Link 1", url: "http://www.example.com" },
              { title: "Link 2 Error", url: "http://www.example.com" },
            ],
          },
          {
            title: "Folder 2 Error",
            children: [
              { title: "Link 3 (not created)", url: "http://www.example.com" },
              { title: "Link 4 (not created)", url: "http://www.example.com" },
            ],
          },
        ],
        createFn,
      });
      expect(errors.length).toBe(2);
      expect(created.length).toBe(2);
      expect(errors).toEqual(
        expect.arrayContaining([
          expect.stringMatching(/Link 2 Error/i),
          expect.stringMatching(/Folder 2 Error/i),
        ])
      );
    });
  });
});
