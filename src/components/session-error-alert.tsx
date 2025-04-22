"use client";

import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSettings } from "@/lib/settings-context";

export function SessionErrorAlert(props: { className?: string }) {
  const [sessionExpired, setSessionExpired] = useState(false);
  const { isSessionKeySet, sessionKey } = useSettings();

  useEffect(() => {
    const handleApiError = (event: CustomEvent<{ error: string }>) => {
      const { error } = event.detail;
      if (error && /Session (Expired|Invalid)|session_id|Odoo session/.test(error)) {
        setSessionExpired(true);
      }
    };

    window.addEventListener("odoo-api-error", handleApiError as EventListener);
    return () => window.removeEventListener("odoo-api-error", handleApiError as EventListener);
  }, []);

  useEffect(() => {
    if (sessionKey && isSessionKeySet) setSessionExpired(false);
  }, [sessionKey, isSessionKeySet]);

  if (!sessionExpired && isSessionKeySet) return null;

  const alertType = sessionExpired ? "destructive" : "default";
  const title = sessionExpired ? "Session Expired" : "Session Key Not Set";
  const message = sessionExpired
    ? "Your Odoo session has expired. Please update your session key or log in again to your Odoo instance."
    : "Please set your Odoo session key to use this application. Without it, you won't be able to fetch data from Odoo.";
  const buttonText = sessionExpired ? "Update Session Key" : "Set Session Key";

  return (
    <Alert variant={alertType} className={props.className}>
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>
        <p className="mb-2">{message}</p>
        <Button
          variant="outline"
          size="sm"
          className="mt-2"
          onClick={() => {
            document.getElementById("settings-dialog-trigger")?.click();
            if (sessionExpired) setSessionExpired(false);
          }}
        >
          {buttonText}
        </Button>
      </AlertDescription>
    </Alert>
  );
}