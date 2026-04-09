import { useCallback, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CloudUpload, X, ImageIcon, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface Props {
  preview: string | null;
  onFile: (f: File) => void;
  onClear: () => void;
  error: string | null;
}

const DragDropUpload = ({ preview, onFile, onClear, error }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);

  const simulateUpload = useCallback((file: File) => {
    setUploading(true);
    setUploadProgress(0);
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 30 + 10;
      if (p >= 100) {
        p = 100;
        clearInterval(iv);
        setUploading(false);
        onFile(file);
      }
      setUploadProgress(Math.min(p, 100));
    }, 200);
  }, [onFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f) simulateUpload(f);
  }, [simulateUpload]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) simulateUpload(f);
  };

  if (preview) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative rounded-2xl overflow-hidden border border-border shadow-[var(--shadow-card)] bg-card"
      >
        <img src={preview} alt="Uploaded crop" className="w-full max-h-80 object-contain bg-muted p-4" />
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-3 right-3 rounded-full shadow-[var(--shadow-elevated)]"
          onClick={onClear}
        >
          <X className="w-4 h-4" />
        </Button>
        <div className="px-4 py-3 border-t border-border flex items-center gap-2 text-sm text-muted-foreground">
          <ImageIcon className="w-4 h-4" />
          Image ready for analysis
        </div>
      </motion.div>
    );
  }

  return (
    <div className="space-y-3">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-12 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${
          dragging
            ? "border-secondary bg-secondary/10"
            : "border-border hover:border-secondary hover:bg-muted/50"
        }`}
      >
        <CloudUpload className="w-14 h-14 text-secondary mb-4" />
        <h3 className="text-xl font-bold text-foreground font-heading">Upload Crop Image</h3>
        <p className="text-muted-foreground mt-2 text-sm">Drag & drop or click to browse</p>
        <p className="text-muted-foreground text-xs mt-1">JPG, PNG, WEBP • Max 10MB</p>
        <p className="text-xs text-accent mt-3 font-medium">💡 Upload a clear leaf image for best results</p>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleChange}
        />
      </div>

      {uploading && (
        <div className="space-y-1">
          <Progress value={uploadProgress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center">Uploading… {Math.round(uploadProgress)}%</p>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 rounded-lg px-4 py-3">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}
    </div>
  );
};

export default DragDropUpload;
