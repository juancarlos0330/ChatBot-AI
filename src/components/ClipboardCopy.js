import React, { useState, useEffect } from "react";
import { FaRegCircleCheck, FaRegCopy } from "react-icons/fa6";

const ClipboardCopy = ({ message }) => {
  const [copyFlag, setCopyFlag] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setCopyFlag(false);
    }, 2000);
  }, [copyFlag]);

  const handleCopy = async () => {
    try {
      // Use the Clipboard API to copy the text
      await navigator.clipboard.writeText(message);
      setCopyFlag(true);
    } catch (err) {
      setCopyFlag(false);
      console.error("Error copying text: ", err);
    }
  };

  return (
    <>
      <button className="copySection" onClick={handleCopy}>
        {copyFlag ? <FaRegCircleCheck /> : <FaRegCopy />}
      </button>
    </>
  );
};

export default ClipboardCopy;
