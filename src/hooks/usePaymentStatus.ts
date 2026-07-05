"use client"

import { useState, useEffect } from "react";

export function usePaymentStatus(checkoutRequestId: string | null) {
  const [status, setStatus] = useState<"pending" | "success" | "failed">("pending");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!checkoutRequestId) {
      setLoading(false);
      return;
    }

    const interval = setInterval(async () => {
      try {
        const res = await fetch(`/api/mpesa/status?checkoutRequestId=${checkoutRequestId}`);
        const data = await res.json();

        if (data.resultCode === 0) {
          setStatus("success");
          setLoading(false);
          clearInterval(interval);
        } else if (data.resultCode !== undefined) {
          setStatus("failed");
          setLoading(false);
          clearInterval(interval);
        }
      } catch (error) {
        console.error("Error checking payment status:", error);
      }
    }, 5000);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      setLoading(false);
    }, 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [checkoutRequestId]);

  return { status, loading };
}
