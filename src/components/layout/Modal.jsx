import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
        <div className="mb-4">
          {children}
        </div>
        <button
          onClick={onClose}
          className="w-full py-2 px-4 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default Modal;
