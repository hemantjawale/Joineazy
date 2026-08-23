import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ConfirmDialog({ open, onClose, onConfirm, title, description, confirmText = "Confirm", variant = "danger" }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <DialogContent>
        <p className="text-sm text-surface-600">{description}</p>
      </DialogContent>
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>Cancel</Button>
        <Button variant={variant} onClick={onConfirm}>{confirmText}</Button>
      </DialogFooter>
    </Dialog>
  );
}
