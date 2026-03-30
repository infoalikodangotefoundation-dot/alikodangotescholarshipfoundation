import React, { useState } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { toast } from 'sonner';
import { UploadCloud, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface FileUploadProps {
  label: string;
  onUploadSuccess: (url: string) => void;
  accept?: string;
  maxSizeMB?: number;
  value?: string;
}

export function FileUpload({ label, onUploadSuccess, accept = "image/*,.pdf", maxSizeMB = 5, value }: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { currentUser } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    if (selectedFile.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB`);
      toast.error(`File size must be less than ${maxSizeMB}MB`);
      return;
    }

    setError(null);
    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file || !currentUser) return;

    setIsUploading(true);
    setError(null);

    const fileExtension = file.name.split('.').pop();
    const fileName = `${currentUser.uid}_${Date.now()}.${fileExtension}`;
    const storageRef = ref(storage, `applications/${currentUser.uid}/${fileName}`);

    const uploadTask = uploadBytesResumable(storageRef, file);

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
        } else if (error.code === 'storage/canceled') {
          errorMsg = "Upload was cancelled.";
        } else if (error.code === 'storage/unknown') {
          errorMsg = "An unknown error occurred during upload.";
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
          setFile(null);
        } catch (err) {
          console.error("Error getting download URL:", err);
          setError("Failed to get file URL.");
          setIsUploading(false);
        }
      }
    );
  };

  return (
    <div className="space-y-2 border p-4 rounded-md bg-slate-50">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        {value && <CheckCircle2 className="w-5 h-5 text-green-500" />}
      </div>
      
      {!value && (
        <>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
            <Input 
              type="file" 
              accept={accept} 
              onChange={handleFileChange} 
              disabled={isUploading}
              className="cursor-pointer bg-white flex-1"
            />
            <Button 
              type="button" 
              onClick={handleUpload} 
              disabled={!file || isUploading}
              variant="secondary"
              className="w-full sm:w-auto"
            >
              <UploadCloud className="w-4 h-4 mr-2" />
              Upload
            </Button>
          </div>
          {error && <p className="text-xs text-red-500 flex items-center"><XCircle className="w-3 h-3 mr-1" />{error}</p>}
          {isUploading && (
            <div className="space-y-1">
              <Progress value={progress} className="h-2" />
              <p className="text-xs text-slate-500 text-right">{Math.round(progress)}%</p>
            </div>
          )}
          <p className="text-xs text-slate-500">Max size: {maxSizeMB}MB. Formats: {accept}</p>
        </>
      )}
      
      {value && (
        <div className="flex items-center justify-between bg-green-50 p-2 rounded border border-green-200 gap-2">
          <span className="text-xs sm:text-sm text-green-700 truncate flex-1">File uploaded successfully</span>
          <Button type="button" variant="ghost" size="sm" onClick={() => onUploadSuccess('')} className="text-red-500 hover:text-red-700 hover:bg-red-50 h-8 px-2 text-xs sm:text-sm">
            Remove
          </Button>
        </div>
      )}
    </div>
  );
}
