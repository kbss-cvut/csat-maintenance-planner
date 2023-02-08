import React, { useEffect, useState } from "react";
import { motion } from "framer-motion/dist/framer-motion";
import { Constants } from "../utils/Constants";

import styles from "./Legend.module.scss";
import classNames from "classnames";

interface Props {
  items: Array<{
    code: string;
    color: string;
    name: string;
    active: boolean;
  }>;
  onSelectLegendItem: (selectedItems: Array<string>) => void;
}

const Legend = ({ items, onSelectLegendItem }: Props) => {
  const [selectedItems, setSelectedItems] = useState<Array<string>>(
    items
      .filter(
        (item) => item.code !== Constants.APPLICATION_TYPE.TASK_CARD_TYPE_GROUP
      )
      .map((item) => item.code)
  );

  useEffect(() => {
    onSelectLegendItem(selectedItems);
  }, [selectedItems]);

  const handleClick = (index, item) => {
    const newItems = [...items];
    newItems[index].active = !newItems[index].active;

    const updatedSelectedItems = selectedItems.includes(item.code)
      ? selectedItems.filter((code) => code !== item.code)
      : [...selectedItems, item.code];
    setSelectedItems(updatedSelectedItems);
  };

  const applicationTypes = items.filter((item) =>
    Object.values(Constants.APPLICATION_TYPE).includes(item.code)
  );

  const taskTypes = items.filter(
    (item) => !Object.values(Constants.APPLICATION_TYPE).includes(item.code)
  );

  return (
    <div className={styles["container"]}>
      <>
        <div className={styles["section"]}>
          <h4>Application types:</h4>
          {applicationTypes.map((legendItem, index) => {
            return (
              <div
                key={index}
                className={classNames([
                  styles["item"],
                  legendItem.active ? styles["active"] : styles["non-active"],
                ])}
                onClick={() => handleClick(index, legendItem)}
              >
                <div
                  className={styles["color"]}
                  style={{ background: `${legendItem.color}` }}
                />
                <motion.div
                  className={styles["label"]}
                  whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
                >
                  {legendItem.name}
                </motion.div>
              </div>
            );
          })}
        </div>

        <div className={styles["section"]}>
          <h4>Task types:</h4>
          {taskTypes.map((legendItem, index) => {
            const offsetIndex = index + applicationTypes.length - 1;

            return (
              <div
                key={offsetIndex}
                className={classNames([
                  styles["item"],
                  legendItem.active ? styles["active"] : styles["non-active"],
                ])}
                onClick={() => handleClick(offsetIndex, legendItem)}
              >
                <div
                  className={styles["color"]}
                  style={{ background: `${legendItem.color}` }}
                />
                <motion.div
                  className={styles["label"]}
                  whileHover={{ scale: 1.1, transition: { duration: 0.1 } }}
                >
                  {legendItem.name}
                </motion.div>
              </div>
            );
          })}
        </div>
      </>
    </div>
  );
};

export default Legend;
