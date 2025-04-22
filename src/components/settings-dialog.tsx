"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useSettings } from "@/lib/settings-context";
import { Settings } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export function SettingsDialog() {
  const { sessionKey, setSessionKey } = useSettings();
  const [inputValue, setInputValue] = useState(sessionKey || "");
  const [open, setOpen] = useState(false);

  const handleSave = () => {
    setSessionKey(inputValue);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          id="settings-dialog-trigger" 
          variant="outline" 
          size="icon" 
          className="mr-2"
        >
          <Settings className="h-[1.2rem] w-[1.2rem]" />
          <span className="sr-only">Settings</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Odoo Settings</DialogTitle>
          <DialogDescription>
            Configure your Odoo session key to connect to your Odoo instance.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="sessionKey">Odoo Session Key</Label>
            <Input
              id="sessionKey"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter your Odoo session_id"
            />
            <p className="text-sm text-muted-foreground">
              This is required to authenticate with your Odoo instance.
            </p>
          </div>
          <Alert>
            <AlertDescription>
              <p className="font-medium mb-1">How to get your Odoo session key:</p>
              <ol className="list-decimal pl-4 space-y-1 text-sm">
                <li>Log in to your Odoo instance in your browser</li>
                <li>Open Developer Tools (F12 or right-click &gt; Inspect)</li>
                <li>Go to the Application tab</li>
                <li>In the Storage section, click Cookies</li>
                <li>Find the cookie named &quot;session_id&quot;</li>
                <li>Copy the value and paste it here</li>
              </ol>
            </AlertDescription>
          </Alert>
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}