import React, { useEffect, useState } from "react";
import { motion } from "framer-motion/dist/framer-motion";

import styles from "./Legend.module.scss";
import classNames from "classnames";

interface Props {
  title: string;
  items: Array<{
    code: string;
    color: string;
    name: string;
    active?: boolean;
  }>;
  onSelectLegendItem: (selectedItems: Array<string>) => void;
}

const Legend = ({ title, items, onSelectLegendItem }: Props) => {
  const [selectedItems, setSelectedItems] = useState<Array<string>>([]);

  useEffect(() => {
    onSelectLegendItem(selectedItems)
  }, [selectedItems])

  const handleClick = (index, item) => {
    const newItems = [...items];
    newItems[index].active = !newItems[index].active;

    const updatedSelectedItems = selectedItems.includes(item.code)
      ? selectedItems.filter((code) => code !== item.code)
      : [...selectedItems, item.code];
    setSelectedItems(updatedSelectedItems);
  };

  return (
    <div className={styles["container"]}>
      <h3>{title}</h3>
      <>
        {items.map((legendItem, index) => {
          return (
            <div
              key={index}
              className={classNames([
                styles["item"],
                legendItem.active ? styles["active"] : null,
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
      </>
    </div>
  );
};

export default Legend;
