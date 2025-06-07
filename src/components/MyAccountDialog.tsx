import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { ArrowLeft, X } from 'lucide-react';
import MyAccount from '@/pages/MyAccount';

interface MyAccountDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MyAccountDialog: React.FC<MyAccountDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="!fixed !left-0 !right-0 !bottom-0 !top-[20px] !w-full !max-w-none !translate-x-0 !translate-y-0 !rounded-t-2xl !p-0 !border-none !shadow-2xl animate-slideInFromBottom"
        style={{ height: 'calc(100vh - 20px)', borderRadius: '20px 20px 0 0' }}
      >
        <div className="flex items-center justify-between border-b px-6 py-4 bg-background">
          
          <DialogHeader className="flex-1 text-center">
            <DialogTitle className="text-lg font-semibold">Profile Settings</DialogTitle>
          </DialogHeader>
          <DialogClose asChild>
            <button
              >
              <X className="h-5 w-5" />
            </button>
          </DialogClose>
        </div>
        <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 20px - 64px)' }}>
          <MyAccount />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MyAccountDialog;

// Make sure this is in your global CSS:
// @keyframes slideInFromBottom {
//   from { transform: translateY(100%); }
//   to { transform: translateY(0); }
// }
// .animate-slideInFromBottom { animation: slideInFromBottom 0.3s cubic-bezier(0.4,0,0.2,1); } 