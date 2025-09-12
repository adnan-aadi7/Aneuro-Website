import toast from "react-hot-toast";

export const toastSuccess = (msg, opts) =>
  toast.success(msg, { duration: 2500, ...opts });

export const toastError = (msg, opts) =>
  toast.error(msg, { duration: 3500, ...opts });

export const toastInfo = (msg, opts) =>
  toast(msg, { duration: 2500, ...opts });

export const toastPromise = (promise, msgs, opts) =>
  toast.promise(
    promise,
    {
      loading: msgs?.loading || "Working...",
      success: msgs?.success || "Done!",
      error: msgs?.error || "Something went wrong",
    },
    opts
  );

export default toast;
