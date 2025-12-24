"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteAccountButton() {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure? This will permanently delete your account, all your events, and all your orders. This action cannot be undone."
      )
    ) {
      return;
    }

    setIsDeleting(true);
    try {
      const response = await fetch("/api/account/delete", {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        alert(`Error: ${data.error || "Failed to delete account"}`);
        return;
      }

      alert("Account deleted successfully. Redirecting...");
      // Redirect to home after deletion
      router.push("/");
      // Optionally sign out (Clerk will handle this automatically)
      window.location.href = "/";
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("An error occurred while deleting your account");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      onClick={handleDeleteAccount}
      disabled={isDeleting}
      className="mt-8 bg-red-600 text-white hover:bg-red-700"
    >
      {isDeleting ? "Deleting..." : "Delete My Account"}
    </Button>
  );
}
