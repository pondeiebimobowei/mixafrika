
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { PartyPopper, Check } from "lucide-react";

interface SuccessDialogProps {
    open: boolean;
    onClose: () => void;
    title: string;
    description: string;
    icon?: 'PartyPopper' | 'Check';
}

export function SuccessDialog({ open, onClose, title, description, icon = 'PartyPopper' }: SuccessDialogProps) {
    const IconComponent = icon === 'Check' ? Check : PartyPopper;
    
    return (
        <AlertDialog open={open} onOpenChange={onClose}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                        <IconComponent className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <AlertDialogTitle className="text-center">{title}</AlertDialogTitle>
                    <AlertDialogDescription className="text-center">
                        {description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogAction onClick={onClose} className="w-full">Done</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
