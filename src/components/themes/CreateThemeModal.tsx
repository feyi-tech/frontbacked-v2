import React, { useState, useRef } from 'react';
import { themesApi } from '@/api/themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Upload, X, FileText } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';

interface CreateThemeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export const CreateThemeModal = ({ open, onOpenChange, onSuccess }: CreateThemeModalProps) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreate = async () => {
    try {
      const theme = await themesApi.create({ name, description, visibility });
      setStep(2);
      // Store theme ID for upload step
      (window as any)._currentThemeId = theme.id;
    } catch (error: any) {
      toast.error("Failed to create theme: " + error.message);
    }
  };

  const handleUpload = async () => {
    const themeId = (window as any)._currentThemeId;
    if (!themeId || files.length === 0) return;

    setUploading(true);
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file, (file as any).webkitRelativePath || file.name);
    });

    try {
      // Note: Actual progress tracking requires xhr or axios,
      // for now we simulate or use a simple await if API doesn't support streaming progress.
      setProgress(30);
      await themesApi.upload(themeId, formData);
      setProgress(100);
      toast.success("Theme uploaded successfully!");
      onSuccess();
      onOpenChange(false);
      reset();
    } catch (error: any) {
      toast.error("Upload failed: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setStep(1);
    setName('');
    setDescription('');
    setFiles([]);
    setProgress(0);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{step === 1 ? "Create New Theme" : "Upload Theme Source"}</DialogTitle>
        </DialogHeader>

        {step === 1 ? (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Theme Name</Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Minimal Portfolio" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="What is this theme for?" />
            </div>
            <div className="space-y-2">
              <Label>Visibility</Label>
              <div className="flex gap-4">
                <Button
                    type="button"
                    variant={visibility === 'public' ? 'default' : 'outline'}
                    onClick={() => setVisibility('public')}
                >
                    Public
                </Button>
                <Button
                    type="button"
                    variant={visibility === 'private' ? 'default' : 'outline'}
                    onClick={() => setVisibility('private')}
                >
                    Private
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div
              className="border-2 border-dashed border-border rounded-xl p-8 text-center cursor-pointer hover:bg-surface transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
              <p className="font-medium">Click to upload theme folder</p>
              <p className="text-sm text-muted-foreground">Or drag and drop files here</p>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                multiple
                {...({ webkitdirectory: "" } as any)}
                onChange={(e) => setFiles(Array.from(e.target.files || []))}
              />
            </div>

            {files.length > 0 && (
              <div className="max-h-40 overflow-y-auto space-y-2">
                <p className="text-sm font-medium">{files.length} files selected</p>
                {files.slice(0, 5).map((f, i) => (
                  <div key={i} className="flex items-center text-xs text-muted-foreground bg-surface p-2 rounded">
                    <FileText className="h-3 w-3 mr-2" />
                    <span className="truncate">{(f as any).webkitRelativePath || f.name}</span>
                  </div>
                ))}
                {files.length > 5 && <p className="text-xs text-center text-muted-foreground">...and {files.length - 5} more</p>}
              </div>
            )}

            {uploading && (
              <div className="space-y-2">
                <Progress value={progress} />
                <p className="text-xs text-center text-muted-foreground">Uploading... {progress}%</p>
              </div>
            )}
          </div>
        )}

        <DialogFooter>
          {step === 1 ? (
            <Button onClick={handleCreate} disabled={!name}>Continue</Button>
          ) : (
            <div className="flex justify-between w-full">
              <Button variant="ghost" onClick={() => setStep(1)} disabled={uploading}>Back</Button>
              <Button onClick={handleUpload} disabled={files.length === 0 || uploading}>
                {uploading ? "Uploading..." : "Finish"}
              </Button>
            </div>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
