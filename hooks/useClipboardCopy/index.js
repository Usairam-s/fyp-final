import { useCallback } from "react";

const useCopyClipboard = () => {
  const copyToClipboard = useCallback((text) => {
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(text)
        .then(() => {
          console.log("Copied to clipboard");
        })
        .catch((err) => {
          console.log("FAILED TO COPY");
        });
    } else {
      console.log("Clipboard API is not avlaible");
    }
  }, []);

  return copyToClipboard;
};

export default useCopyClipboard;
