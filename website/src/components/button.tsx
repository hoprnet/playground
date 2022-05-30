import type { PropsWithChildren, MouseEventHandler } from "react";
import styles from "../../styles/components/button.module.scss";

const Button = (
  props: PropsWithChildren<{
    onClick: MouseEventHandler<HTMLDivElement>;
  }>
) => {
  return (
    <div className={styles.container} onClick={props.onClick}>
      {props.children}
    </div>
  );
};

export default Button;
