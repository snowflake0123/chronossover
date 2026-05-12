import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import styles from "./AppHeader.module.css";

type Props = {
  title?: ReactNode;
  back?: { to: string; label: string };
  right?: ReactNode;
};

export const AppHeader = ({ title, back, right }: Props) => {
  return (
    <>
      <div className={styles.globalNav}>
        <span className={styles.wordmark}>Chronossover</span>
      </div>
      {back || title || right ? (
        <div className={styles.subNav}>
          {back || title ? (
            <div className={styles.subNavLeft}>
              {back ? (
                <Link to={back.to} className={styles.backLink}>
                  ‹ {back.label}
                </Link>
              ) : null}
              {title ? <h1 className={styles.title}>{title}</h1> : null}
            </div>
          ) : null}
          {right ? <div className={styles.subNavRight}>{right}</div> : null}
        </div>
      ) : null}
    </>
  );
};
