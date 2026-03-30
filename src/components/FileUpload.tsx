import React, { useState, useEffect } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { UploadCloud, CheckCircle2, XCircle, FileText, FileImage, File as FileIcon, Trash2, Loader2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface FileUploadProps {
  label: string;
  onUploadSuccess: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
  value?: string;
}

export function FileUpload({ label, onUploadSuccess, accept = "image/*,.pdf", maxSizeMB = 5, value }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      const url = URL.createObjectURL(selectedFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [selectedFile]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > maxSizeMB * 1024 * 1024) {
      const msg = `File size must be less than ${maxSizeMB}MB`;
      setError(msg);
      toast.error(msg);
      return;
    }

    setError(null);
    setSelectedFile(file);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!selectedFile || !currentUser) return;

    setIsUploading(true);
    setError(null);

    const fileExtension = selectedFile.name.split('.').pop();
    const fileName = `${currentUser.uid}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `applications/${currentUser.uid}/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, selectedFile);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error("Upload error:", error);
        let errorMsg = "Failed to upload file. Please try again.";
        if (error.code === 'storage/unauthorized') {
          errorMsg = "You don't have permission to upload this file.";
        }
        setError(errorMsg);
        toast.error(errorMsg);
        setIsUploading(false);
      },
      async () => {
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          onUploadSuccess(downloadURL);
          toast.success(`${label} uploaded successfully`);
          setIsUploading(false);
          setSelectedFile(null);
        } catch (err) {
          console.error("Error getting download URL:", err);
          setError("Failed to get file URL.");
          setIsUploading(false);
        }
      }
    );
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = () => {
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/')) return <FileImage className="w-8 h-8 text-blue-500" />;
      if (selectedFile.type === 'application/pdf') return <FileText className="w-8 h-8 text-red-500" />;
      return <FileIcon className="w-8 h-8 text-slate-500" />;
    }
    return <UploadCloud className="w-8 h-8 text-slate-400" />;
  };

  return (
    <div className="space-y-3 border-2 border-dashed p-4 rounded-lg bg-slate-50/50 transition-colors hover:bg-slate-50">
      <div className="flex items-center justify-between">
        <Label className="text-sm font-semibold text-slate-700">{label}</Label>
        {value && <CheckCircle2 className="w-5 h-5 text-green-500" />}
      </div>
      
      {!value && !selectedFile && (
        <div className="relative">
          <Input 
            type="file" 
            accept={accept} 
            onChange={handleFileChange} 
            disabled={isUploading}
            className="absolute inset-0 opacity-0 cursor-pointer z-10 h-full"
          />
          <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center gap-2 bg-white">
            <UploadCloud className="w-8 h-8 text-slate-400" />
            <p className="text-sm text-slate-600 font-medium">Click or drag to select file</p>
            <p className="text-xs text-slate-400">Max size: {maxSizeMB}MB. Formats: {accept}</p>
          </div>
        </div>
      )}

      {selectedFile && !value && (
        <div className="bg-white border rounded-lg p-3 space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded bg-slate-100 flex items-center justify-center overflow-hidden border">
              {previewUrl ? (
                <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                getFileIcon()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{selectedFile.name}</p>
              <p className="text-xs text-slate-500">{formatSize(selectedFile.size)} • {selectedFile.type || 'Unknown type'}</p>
            </div>
            <Button 
              type="button" 
              variant="ghost" 
              size="icon" 
              onClick={() => setSelectedFile(null)}
              disabled={isUploading}
              className="text-slate-400 hover:text-red-500"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>

          {isUploading ? (
            <div className="space-y-1.5">
              <div className="flex justify-between text-[10px] font-medium text-slate-500">
                <span>Uploading...</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-1.5" />
            </div>
          ) : (
            <Button 
              type="button" 
              onClick={handleUpload} 
              className="w-full bg-green-600 hover:bg-green-700 h-9 text-sm"
            >
              <UploadCloud className="w-4 h-4 mr-2" />
              Start Upload
            </Button>
          )}
        </div>
      )}
      
      {value && (
        <div className="flex items-center gap-3 bg-green-50 p-3 rounded-lg border border-green-200">
          <div className="w-10 h-10 rounded bg-green-100 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6 text-green-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-green-800">File uploaded successfully</p>
            <a 
              href={value} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-xs text-green-600 hover:underline truncate block"
            >
              View uploaded file
            </a>
          </div>
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={() => onUploadSuccess('')} 
            className="text-red-500 hover:text-red-700 hover:bg-red-100 h-8 px-2"
          >
            <Trash2 className="w-4 h-4 mr-1" />
            Remove
          </Button>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
          <XCircle className="w-3 h-3" />
          {error}
        </p>
      )}
    </div>
  );
}
