// Modal.js
import React from 'react';

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed text-2xl bg-white text-center z-10 rounded-md border p-10">
      <div className="modal-content">
        <button className="absolute right-2 top-1 text-red-500" onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
