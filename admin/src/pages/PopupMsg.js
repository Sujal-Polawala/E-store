import React, { useEffect, useState } from "react";

const PopupMsg = ({ message, type = "info", onClose }) => {
  // Dynamic background and icon based on the type
  const typeStyles = {
    success: "bg-green-100 border-green-500 text-green-800",
    error: "bg-red-100 border-red-500 text-red-800",
    info: "bg-blue-100 border-blue-500 text-blue-800",
  };

  const icon = {
    success: "✓",
    error: "✗",
    info: "ℹ",
  };

  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto close after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      onClose?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  if (!visible) return null;

  return (
    <div
      className={`fixed bottom-4 right-4 z-50 max-w-sm border-l-4 p-4 rounded-lg shadow-lg ${typeStyles[type]}`}
    >
      <div className="flex items-center">
        <span className="mr-2 text-2xl">{icon[type]}</span>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={() => {
            setVisible(false);
            onClose?.();
          }}
          className="ml-2 text-gray-500 hover:text-gray-700"
        >
          &#10005;
        </button>
      </div>
    </div>
  );
};

export default PopupMsg;
