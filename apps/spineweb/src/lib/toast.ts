import { toast } from 'react-hot-toast';

export const adminToast = {
  success(message: string) {
    toast.success(message);
  },
  error(message: string) {
    toast.error(message);
  },
  promise<T>(
    operation: Promise<T>,
    messages: {
      loading: string;
      success: string;
      error: string;
    },
  ) {
    return toast.promise(operation, messages);
  },
};
