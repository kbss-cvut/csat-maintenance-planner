import React from "react";

import styles from "./Badge.module.scss";

interface Props {
  count: number;
}
const Badge = ({ count }: Props) => {
  return (
    <>
      {count > 0 && (
        <div className={styles.container}>
          <span className={styles.count}>{count}</span>
        </div>
      )}
    </>
  );
};

export default Badge;
