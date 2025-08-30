"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "lucide-react";
import React, { useState } from "react";

type DeleteProductDialogProps = {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  productName: string;
  handleDeleteFunc: () => void;
  isLoading: boolean;
};

const ConfirmDelete = ({
  open,
  setOpen,
  productName,
  handleDeleteFunc,
  isLoading,
}: DeleteProductDialogProps) => {
  // === confirmation state ===
  const [confirmation, setConfirmation] = useState("");
  const confirmationText = `Delete ${productName}`;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-sm p-0 overflow-hidden">
        <DialogHeader className="px-6 pt-6">
          <DialogTitle>Delete Product</DialogTitle>
          <DialogDescription className="sr-only">
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-6">
          <Label className="text-muted-foreground">
            Are you sure you want to delete
            <strong className="text-foreground">{productName}?</strong>
          </Label>
          <span className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Type <span className="text-destructive">{confirmationText}</span>{" "}
              to delete this.
            </p>
            <Input
              onChange={(e) => setConfirmation(e.target.value)}
              placeholder={confirmationText}
            />
          </span>
        </div>
        <div className="w-full grid grid-cols-2 gap-4 p-6 bg-muted/50 border-t">
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            variant="destructive"
            disabled={confirmation !== confirmationText || isLoading}
            onClick={() => handleDeleteFunc()}
          >
            {isLoading ? (
              <>
                Deleting..
                <Loader className="size-4 animate-spin" />
              </>
            ) : (
              `Delete`
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmDelete;
