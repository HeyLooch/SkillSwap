// src\widgets\popup\Popup.tsx

import { ReactNode, useEffect, useRef } from "react";
import styles from './Popup.module.css';

type TPopupProps = {
  children: ReactNode;
  isOpen: boolean;
  onClose: () => void;
};

export const Popup = ({ children, isOpen, onClose }:TPopupProps) => {
  const popupRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      if (target.closest("[data-popup-trigger]")) return;
      if (popupRef.current && !popupRef.current.contains(target as Node)) {
        onClose();
      }
    };
    const handleEsc = (e:KeyboardEvent) => {
      e.key === 'Escape' && onClose();
    };

    if(isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className={styles.popup_container} ref={popupRef}>
      <div className={styles.content}>{children}</div>
    </div>
  )
};