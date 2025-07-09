import { useEffect, useState } from "react";
import GiftsTable from "./GiftsTable";
import type { GiftProps } from "@models/type";

export const Gifts = ({ admin }: GiftProps) => {
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const password = urlParams.get("password");

    if (admin) {
      // If user is admin, authorize immediately
      setIsAuthorized(true);
      setIsLoading(false);
      return;
    }

    if (!password) {
      // No password provided, redirect or block
      window.location.href = "/forbidden";
      return;
    }

    // Call server API to verify password
    fetch(`/api/check-password?password=${encodeURIComponent(password)}`)
      .then((res) => {
        if (!res.ok) throw new Error("Unauthorized");
        return res.json();
      })
      .then((data) => {
        if (data.authorized) {
          setIsAuthorized(true);
        } else {
          window.location.href = "/forbidden";
        }
      })
      .catch(() => {
        window.location.href = "/forbidden";
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [admin]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthorized) {
    return null;
  }

  return (
    <div id="gifts-container">
      <GiftsTable admin={admin} />
    </div>
  );
};
