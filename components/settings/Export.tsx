"use client";

import { useRef, useState } from "react";
import { Download, FileJson, Loader2, Upload } from "lucide-react";
import { toast } from "sonner";

import { exportToPdf, exportToPng } from "@/lib/utils";
import { useMutation, useStorage } from "@/liveblocks.config";
import { LiveMap } from "@liveblocks/client";
import { Button } from "../ui/button";

const Export = () => {
  const [pngLoading, setPngLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canvasObjects = useStorage((root) => root.canvasObjects);

  const replaceObjects = useMutation(
    ({ storage }, entries: Array<[string, unknown]>) => {
      storage.set("canvasObjects", new LiveMap(entries as [string, any][]));
    },
    []
  );

  const handlePng = async () => {
    setPngLoading(true);
    try {
      exportToPng();
      toast.success("PNG exported successfully");
    } catch {
      toast.error("Failed to export PNG");
    } finally {
      setPngLoading(false);
    }
  };

  const handlePdf = async () => {
    setPdfLoading(true);
    try {
      exportToPdf();
      toast.success("PDF exported successfully");
    } catch {
      toast.error("Failed to export PDF");
    } finally {
      setPdfLoading(false);
    }
  };

  const handleExportJson = () => {
    if (!canvasObjects) {
      toast.error("Nothing to export yet");
      return;
    }
    const entries = Array.from(canvasObjects.entries());
    const payload = {
      version: 1,
      exportedAt: new Date().toISOString(),
      objects: entries,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ui-studio-board-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Board exported as JSON");
  };

  const handleImportClick = () => fileInputRef.current?.click();

  const handleImportJson = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = JSON.parse(text);
      const entries = Array.isArray(parsed?.objects) ? parsed.objects : null;
      if (!entries) {
        toast.error("Invalid board file");
        return;
      }
      const confirmed = window.confirm(
        "Replace the current board with this file? This cannot be undone."
      );
      if (!confirmed) return;
      replaceObjects(entries);
      toast.success(`Imported ${entries.length} object(s)`);
    } catch {
      toast.error("Couldn't read that file");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <div className="flex flex-col gap-2 px-4 py-3">
      <Button
        variant="outline"
        disabled={pngLoading}
        className="w-full border border-primary-grey-100 hover:bg-primary-green hover:text-primary-black disabled:opacity-50"
        onClick={handlePng}
      >
        {pngLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
        Export PNG
      </Button>
      <Button
        variant="outline"
        disabled={pdfLoading}
        className="w-full border border-primary-grey-100 hover:bg-primary-green hover:text-primary-black disabled:opacity-50"
        onClick={handlePdf}
      >
        {pdfLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
        Export PDF
      </Button>
      <Button
        variant="outline"
        className="w-full border border-primary-grey-100 hover:bg-primary-green hover:text-primary-black"
        onClick={handleExportJson}
      >
        <Download className="mr-2 h-3 w-3" />
        Export JSON
      </Button>
      <Button
        variant="outline"
        className="w-full border border-primary-grey-100 hover:bg-primary-green hover:text-primary-black"
        onClick={handleImportClick}
      >
        <Upload className="mr-2 h-3 w-3" />
        Import JSON
      </Button>
      <input
        ref={fileInputRef}
        type="file"
        accept="application/json"
        className="hidden"
        onChange={handleImportJson}
      />
      <p className="flex items-center gap-1 text-[10px] text-primary-grey-300">
        <FileJson className="h-3 w-3" />
        Import replaces the current board.
      </p>
    </div>
  );
};

export default Export;
