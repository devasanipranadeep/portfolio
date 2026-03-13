import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Upload, Download, Trash2, Save } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface ResumeFile {
  id: string;
  name: string;
  url: string;
  size: number;
  created_at: string;
}

const AdminResume = () => {
  const [resumeFile, setResumeFile] = useState<ResumeFile | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Fetch current resume
  const fetchResume = async () => {
    const { data, error } = await supabase
      .storage
      .from('resumes')
      .list();
    
    if (error) {
      console.error('Error fetching resume:', error);
      return;
    }

    if (data && data.length > 0) {
      const { data: { publicUrl } } = supabase
        .storage
        .from('resumes')
        .getPublicUrl(data[0].name);
      
      setResumeFile({
        id: data[0].id,
        name: data[0].name,
        url: publicUrl,
        size: data[0].metadata?.size || 0,
        created_at: data[0].created_at
      });
    }
  };

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if it's a PDF
      if (file.type !== 'application/pdf') {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive"
        });
        return;
      }
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please upload a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }
      
      setSelectedFile(file);
    }
  };

  // Upload new resume
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);

    try {
      // Delete existing resume if it exists
      if (resumeFile) {
        await supabase
          .storage
          .from('resumes')
          .remove([resumeFile.name]);
      }

      // Upload new resume
      const fileName = `resume-${Date.now()}.pdf`;
      const { data, error } = await supabase
        .storage
        .from('resumes')
        .upload(fileName, selectedFile, {
          upsert: true,
          onUploadProgress: (progress) => {
            setUploadProgress((progress.loaded / progress.total) * 100);
          }
        });

      if (error) {
        throw error;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('resumes')
        .getPublicUrl(fileName);

      // Update state
      setResumeFile({
        id: data.id,
        name: data.name,
        url: publicUrl,
        size: selectedFile.size,
        created_at: new Date().toISOString()
      });

      toast({
        title: "Resume uploaded successfully",
        description: "Your resume has been updated"
      });

      setSelectedFile(null);
      setUploadProgress(0);
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload resume. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  // Delete resume
  const handleDelete = async () => {
    if (!resumeFile) return;

    try {
      const { error } = await supabase
        .storage
        .from('resumes')
        .remove([resumeFile.name]);

      if (error) throw error;

      setResumeFile(null);
      toast({
        title: "Resume deleted",
        description: "Your resume has been removed"
      });
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        title: "Delete failed",
        description: "Failed to delete resume. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Load resume on component mount
  useEffect(() => {
    fetchResume();
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-foreground mb-2">Resume Management</h1>
        <p className="text-muted-foreground">Upload and manage your resume PDF file</p>
      </div>

      <div className="grid gap-6">
        {/* Current Resume */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="text-primary" size={20} />
              Current Resume
            </CardTitle>
            <CardDescription>
              {resumeFile ? 'Your current resume file' : 'No resume uploaded yet'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {resumeFile ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <FileText className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="font-medium">{resumeFile.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(resumeFile.size)} • 
                        {new Date(resumeFile.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(resumeFile.url, '_blank')}
                    >
                      <Download size={16} className="mr-1" />
                      View
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={handleDelete}
                    >
                      <Trash2 size={16} className="mr-1" />
                      Delete
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No resume uploaded yet</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Upload New Resume */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="text-primary" size={20} />
              Upload New Resume
            </CardTitle>
            <CardDescription>
              Upload a new PDF file to replace your current resume
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileSelect}
                className="hidden"
                id="resume-upload"
              />
              <label
                htmlFor="resume-upload"
                className="cursor-pointer flex flex-col items-center gap-2"
              >
                <Upload size={32} className="text-muted-foreground" />
                <p className="font-medium">Click to upload or drag and drop</p>
                <p className="text-sm text-muted-foreground">
                  PDF files only (max 10MB)
                </p>
              </label>
            </div>

            {selectedFile && (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                  <div className="flex items-center gap-3">
                    <FileText size={16} />
                    <div>
                      <p className="font-medium text-sm">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {formatFileSize(selectedFile.size)}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove
                  </Button>
                </div>

                {uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Uploading...</span>
                      <span>{Math.round(uploadProgress)}%</span>
                    </div>
                    <Progress value={uploadProgress} className="w-full" />
                  </div>
                )}

                <Button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full"
                >
                  <Save size={16} className="mr-2" />
                  {uploading ? 'Uploading...' : 'Upload Resume'}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
};

export default AdminResume;
