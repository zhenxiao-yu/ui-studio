"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { exportToPdf, exportToPng } from "@/lib/utils";
import { Button } from "../ui/button";

const Export = () => {
  const [pngLoading, setPngLoading] = useState(false);
  const [pdfLoading, setPdfLoading] = useState(false);

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

  return (
    <div className='flex flex-col gap-3 px-5 py-3'>
      <h3 className='text-[10px] uppercase'>Export</h3>
      <Button
        variant='outline'
        disabled={pngLoading}
        className='w-full border border-primary-grey-100 hover:bg-primary-green hover:text-primary-black disabled:opacity-50'
        onClick={handlePng}
      >
        {pngLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
        Export to PNG
      </Button>
      <Button
        variant='outline'
        disabled={pdfLoading}
        className='w-full border border-primary-grey-100 hover:bg-primary-green hover:text-primary-black disabled:opacity-50'
        onClick={handlePdf}
      >
        {pdfLoading ? <Loader2 className="mr-2 h-3 w-3 animate-spin" /> : null}
        Export to PDF
      </Button>
    </div>
  );
};

export default Export;
