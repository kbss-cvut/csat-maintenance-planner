import React from "react";

import styles from "./Backdrop.module.scss";

interface Props {
  children: React.ReactNode;
  onClick: () => void;
}

const Backdrop = ({ children, onClick }: Props) => {
  return (
    <div className={styles.backdrop} onClick={onClick}>
      {children}
    </div>
  );
};

export default Backdrop;
