import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useState } from "react";

type AccountAvatarUploadProps = {
  user: { name: string; email: string; avatar: string };
  setUser: (user: { name: string; email: string; avatar: string }) => void;
};

export function AccountAvatarUpload({ user, setUser }: AccountAvatarUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(user.avatar || "");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setPreviewUrl(URL.createObjectURL(selectedFile));
    }
  };

  const handleUpload = async () => {
    if (!file) return;

    const accessToken = localStorage.getItem("access_token");
    if (!accessToken) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("http://localhost:5000/user/avatar", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${accessToken}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to upload avatar");
      }

      const data = await response.json();

      setUser({
        ...user,
        avatar: data.avatar_url,
      });

      alert("Profile picture updated successfully!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle>Profile Picture</CardTitle>
        <CardDescription>Upload a new profile photo.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {previewUrl && (
          <div className="flex justify-center">
            <img
              src={previewUrl}
              alt="Avatar Preview"
              className="rounded-full w-32 h-32 object-cover border-2"
            />
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="avatar">Select Image</Label>
          <Input
            id="avatar"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>

        <Button
          className="mt-4 hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 transition-all duration-300 transform hover:scale-105 active:scale-95"
          onClick={handleUpload}
          disabled={!file}
        >
          Upload Avatar
        </Button>
      </CardContent>
    </Card>
  );
}
