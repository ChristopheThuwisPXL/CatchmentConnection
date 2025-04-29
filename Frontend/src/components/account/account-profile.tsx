import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

type AccountProfileProps = {
  user: { name: string; email: string };
  setUser: (user: { name: string; email: string }) => void;
  onSave: (e: React.FormEvent) => void;
};

export function AccountProfile({ user, setUser, onSave }: AccountProfileProps) {
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSave(e);
    setShowSuccessDialog(true);
  };

  return (
    <>
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Profile</CardTitle>
          <CardDescription>Update your basic information.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              placeholder="Enter your name"
              value={user.name}
              onChange={(e) => setUser({ ...user, name: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
            />
          </div>

          <Button
            className="mt-4 hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 transition-all duration-300 transform hover:scale-105 active:scale-95"
            onClick={handleSave}
          >
            Save Changes
          </Button>
        </CardContent>
      </Card>

      {/* Success Dialog */}
      <AlertDialog open={showSuccessDialog} onOpenChange={setShowSuccessDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Profile Updated!</AlertDialogTitle>
            <AlertDialogDescription>
              Your profile information was successfully updated.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => setShowSuccessDialog(false)}>
              OK
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
