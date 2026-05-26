import { describe, it, expect, vi, beforeEach } from "vitest";
import { ProjectService, sanitizeFilename, getPathFromUrl } from "@/services/projects";
import { SupabaseClient } from "@supabase/supabase-js";

describe("Servicios: ProjectService", () => {
  let mockSupabase: any;

  beforeEach(() => {
    vi.clearAllMocks();

    // Mocks encadenados para consultas de Supabase Database
    const chain = {
      select: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockImplementation(() => Promise.resolve({ data: { id: 1, name: "Test" }, error: null })),
      insert: vi.fn().mockReturnThis(),
      update: vi.fn().mockReturnThis(),
      delete: vi.fn().mockReturnThis(),
      then: vi.fn(),
    };

    // Ajustes para simular respuestas de promesas en Supabase Client
    chain.then = vi.fn().mockImplementation((resolve) => resolve({ data: [{ id: 1, name: "Test" }], error: null }));

    // Mock de Supabase Storage
    const storageChain = {
      upload: vi.fn().mockResolvedValue({ data: {}, error: null }),
      remove: vi.fn().mockResolvedValue({ data: {}, error: null }),
      move: vi.fn().mockResolvedValue({ data: {}, error: null }),
      getPublicUrl: vi.fn().mockReturnValue({ data: { publicUrl: "https://example.com/url.png" } }),
    };

    mockSupabase = {
      from: vi.fn().mockReturnValue(chain),
      storage: {
        from: vi.fn().mockReturnValue(storageChain),
      },
    } as unknown as SupabaseClient;
  });

  describe("Helpers", () => {
    it("sanitizeFilename debe slugificar nombres correctamente", () => {
      expect(sanitizeFilename("Proyecto Test #1!")).toBe("proyecto-test-1");
      expect(sanitizeFilename("Árbol de Obsidiana")).toBe("arbol-de-obsidiana");
    });

    it("getPathFromUrl debe extraer la ruta del bucket", () => {
      const url = "https://host.supabase.co/storage/v1/object/sign/PortafolioBucket/1-test-cover.png?token=123";
      expect(getPathFromUrl(url)).toBe("1-test-cover.png");
      expect(getPathFromUrl("https://cloudinary.com/image.png")).toBeNull();
    });
  });

  describe("CRUD de Base de Datos", () => {
    it("getAll debe llamar a supabase con la consulta correcta", async () => {
      await ProjectService.getAll(mockSupabase);
      expect(mockSupabase.from).toHaveBeenCalledWith("Projects");
    });

    it("getById debe filtrar por ID y pedir single", async () => {
      await ProjectService.getById(mockSupabase, 1);
      expect(mockSupabase.from).toHaveBeenCalledWith("Projects");
    });

    it("create debe insertar el registro en Supabase", async () => {
      const mockInput = {
        name: "Nuevo",
        description: "Desc",
        technologies: ["React"],
        typeApp: "Web",
        linkDemo: "https://demo.com",
        linkRepo: "https://repo.com",
      };
      await ProjectService.create(mockSupabase, mockInput);
      expect(mockSupabase.from).toHaveBeenCalledWith("Projects");
    });
  });

  describe("CRUD de Storage", () => {
    it("uploadCover debe subir el archivo y retornar la URL pública", async () => {
      const file = new File(["foo"], "cover.png", { type: "image/png" });
      const url = await ProjectService.uploadCover(mockSupabase, 1, "test", file);
      
      expect(mockSupabase.storage.from).toHaveBeenCalledWith("PortafolioBucket");
      expect(url).toBe("https://example.com/url.png");
    });

    it("removeStorageFiles debe invocar la eliminación si se pasan rutas", async () => {
      await ProjectService.removeStorageFiles(mockSupabase, ["path1.png"]);
      expect(mockSupabase.storage.from).toHaveBeenCalledWith("PortafolioBucket");
    });

    it("renameImages debe omitirse si el nombre es el mismo", async () => {
      const project = { image: "old-url", gallery_images: [] };
      const res = await ProjectService.renameImages(mockSupabase, 1, "test", "test", project);
      expect(res).toEqual(project);
      expect(mockSupabase.storage.from).not.toHaveBeenCalled();
    });
  });
});
