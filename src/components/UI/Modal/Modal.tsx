import React from "react";
import { IoMdCloseCircle } from "react-icons/io";
import styles from "./Modal.module.scss";

const Modal = ({
  isOpen,
  onClose,
  children,
}: {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) => {
  if (!isOpen) {
    return null;
  }

  // Stop event propagation from modal to overlay
  const handleModalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div
      className={styles["modal-overlay"]}
      role="button"
      tabIndex={0}
      onKeyDown={() => onClose()}
      onClick={onClose}
    >
      <div className={styles["modal-wrapper"]}>
        <div
          className={styles["modal"]}
          onClick={handleModalClick}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              handleModalClick(e as unknown as React.MouseEvent<Element>);
            }
          }}
        >
          <div className={styles["modal-header"]}>
            <div className={styles["close-button"]}>
              <IoMdCloseCircle onClick={onClose} />
            </div>
          </div>

          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
