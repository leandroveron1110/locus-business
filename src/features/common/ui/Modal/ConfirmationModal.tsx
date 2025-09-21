// src/features/common/ui/Modal/ConfirmationModal.tsx

"use client";

import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';

interface ConfirmationModalProps {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface ConfirmationModalRef {
  open: () => void;
  close: () => void;
}

const ConfirmationModal = forwardRef<ConfirmationModalRef, ConfirmationModalProps>(
  ({ title, message, onConfirm, onCancel }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    const modalRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
    }));

    if (!isOpen) {
      return null;
    }

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
        <div ref={modalRef} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm mx-4">
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{title}</h3>
          <p className="text-gray-600 mb-6">{message}</p>
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => {
                onCancel();
                setIsOpen(false);
              }}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-all"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={() => {
                onConfirm();
                setIsOpen(false);
              }}
              className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-all"
            >
              Eliminar
            </button>
          </div>
        </div>
      </div>
    );
  }
);

ConfirmationModal.displayName = 'ConfirmationModal';

export default ConfirmationModal;