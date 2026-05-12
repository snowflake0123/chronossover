import styles from "./Spinner.module.css";

export const Spinner = () => (
  <div className={styles.dots} aria-label="Loading">
    <span className={styles.dot} />
    <span className={styles.dot} />
    <span className={styles.dot} />
  </div>
);
