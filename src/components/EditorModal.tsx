import React from "react";
import Backdrop from "./Backdrop";

import styles from "./EditorModal.module.scss";

interface Props {
  groups: any[];
  handleClose: () => void;
}

const EditorModal = ({ groups, handleClose }: Props) => {
  console.log(groups);
  return (
    <Backdrop onClick={handleClose}>
      <div className={styles.container} onClick={(e) => e.stopPropagation()}>
        <div className={styles["resources-container"]}>
          {groups.map((group, index: number) => (
            <>
              {group.level < 3 && (
                <li className={styles.items} key={index}>
                  {group.title}
                </li>
              )}
            </>
          ))}
        </div>
        <div className={styles["buttons-container"]}>
          <button className={styles.discard}>Discard</button>
          <button className={styles.confirm}>Confirm</button>
        </div>
      </div>
    </Backdrop>
  );
};

export default EditorModal;
