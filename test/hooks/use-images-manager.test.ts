import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { useImagesManager } from "@/hooks/use-images-manager";

// Mock de URL.createObjectURL ya que no está disponible en jsdom por defecto
if (typeof window !== "undefined") {
  window.URL.createObjectURL = vi.fn(() => "mock-blob-url");
}

describe("Hook: useImagesManager", () => {
  it("debe inicializar estados por defecto correctamente", () => {
    const { result } = renderHook(() => useImagesManager());

    expect(result.current.coverFile).toBeNull();
    expect(result.current.coverPreview).toBeNull();
    expect(result.current.galleryFiles).toEqual([]);
    expect(result.current.galleryPreviews).toEqual([]);
  });

  it("debe rellenar estados iniciales si se proveen props", () => {
    const { result } = renderHook(() =>
      useImagesManager({
        initialCover: "https://example.com/cover.png",
        initialGallery: ["https://example.com/gal1.png"],
      })
    );

    expect(result.current.coverPreview).toBe("https://example.com/cover.png");
    expect(result.current.galleryPreviews).toEqual(["https://example.com/gal1.png"]);
  });

  it("debe actualizar la portada con handleCoverChange", () => {
    const { result } = renderHook(() => useImagesManager());
    const file = new File(["cover-data"], "cover.png", { type: "image/png" });

    act(() => {
      result.current.handleCoverChange({
        target: { files: [file] },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.coverFile).toBe(file);
    expect(result.current.coverPreview).toBe("mock-blob-url");
  });

  it("debe añadir imágenes a la galería con handleGalleryChange", () => {
    const { result } = renderHook(() => useImagesManager());
    const file1 = new File(["data1"], "img1.png", { type: "image/png" });
    const file2 = new File(["data2"], "img2.png", { type: "image/png" });

    act(() => {
      result.current.handleGalleryChange({
        target: { files: [file1, file2] },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.galleryFiles).toEqual([file1, file2]);
    expect(result.current.galleryPreviews).toEqual(["mock-blob-url", "mock-blob-url"]);
  });

  it("debe remover imágenes locales de la galería", () => {
    const { result } = renderHook(() => useImagesManager());
    const file1 = new File(["data1"], "img1.png", { type: "image/png" });

    act(() => {
      result.current.handleGalleryChange({
        target: { files: [file1] },
      } as unknown as React.ChangeEvent<HTMLInputElement>);
    });

    expect(result.current.galleryFiles.length).toBe(1);

    act(() => {
      result.current.removeGalleryImage(0); // Remover el primer elemento local
    });

    expect(result.current.galleryFiles).toEqual([]);
    expect(result.current.galleryPreviews).toEqual([]);
  });

  it("debe disparar onRemoveExisting si se elimina una imagen existente de la galería", async () => {
    const onRemoveMock = vi.fn().mockResolvedValue(undefined);
    const { result } = renderHook(() =>
      useImagesManager({
        initialGallery: ["https://example.com/existing.png"],
        onRemoveExisting: onRemoveMock,
      })
    );

    await act(async () => {
      await result.current.removeGalleryImage(0);
    });

    expect(onRemoveMock).toHaveBeenCalledWith("https://example.com/existing.png", 0);
    expect(result.current.galleryPreviews).toEqual([]);
  });
});
