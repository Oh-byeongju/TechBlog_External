import React from "react";

import styles from "./Overlay.module.scss";

type Props = {
    children: React.ReactNode;
}

const Overlay = ({children}: Props) =>
    <div className={styles.baseContainer}>{children}</div>

export default Overlay;
