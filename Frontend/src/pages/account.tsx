import { AppSidebar } from "@/components/app-sidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteHeader } from "@/components/site-header";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function Account() {
  const showMonthRangePicker = false;

  return (
    <SidebarProvider>
      <AppSidebar variant="inset" />
      <SidebarInset>
        <SiteHeader showMonthRangePicker={showMonthRangePicker} />
        
        <div className="flex flex-col gap-6 p-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Account Settings</h1>
            <p className="text-muted-foreground text-sm mt-1">
              Manage your account details, security settings, and more.
            </p>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Profile Information */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Update your basic information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" placeholder="Enter your name" defaultValue="John Doe" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" placeholder="Enter your email" defaultValue="john@example.com" />
                </div>

                {/* Updated Button with Hover & Transition Effects */}
                <Button className="mt-4 hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 transition-all duration-300 transform hover:scale-105 active:scale-95">
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            {/* Password Settings */}
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle>Security</CardTitle>
                <CardDescription>Change your password to keep your account secure.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input id="current-password" type="password" placeholder="Current password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input id="new-password" type="password" placeholder="New password" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirm new password" />
                </div>

                {/* Updated Button with Hover & Transition Effects */}
                <Button className="mt-4 hover:bg-primary-600 focus:ring-4 focus:ring-primary-300 transition-all duration-300 transform hover:scale-105 active:scale-95">
                  Update Password
                </Button>
              </CardContent>
            </Card>
          </div>

          <Separator className="my-8" />

          {/* Danger Zone */}
          <Card className="bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800">
            <CardHeader>
              <CardTitle className="text-red-600 dark:text-red-400">Danger Zone</CardTitle>
              <CardDescription>
                Deleting your account is permanent and cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Updated Button with Hover & Transition Effects */}
              <Button
                variant="destructive"
                className="hover:bg-red-600 focus:ring-4 focus:ring-red-300 transition-all duration-300 transform hover:scale-105 active:scale-95"
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
