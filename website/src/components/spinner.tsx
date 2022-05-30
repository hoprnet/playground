import React from "react";
import styles from "../../styles/components/spinner.module.scss";

const Spinner: React.FC<{ size: number }> = ({ size }) => {
  return (
    <div style={{ height: size, width: size }} className={styles.loading}></div>
  );
};

export default Spinner;
