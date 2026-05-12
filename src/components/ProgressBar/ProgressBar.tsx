import styles from "./ProgressBar.module.css";

export const ProgressBar = () => (
  <div className={styles.bar} role="progressbar" aria-label="Loading">
    <div className={styles.track} />
  </div>
);
