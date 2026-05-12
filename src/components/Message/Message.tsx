import type { Message as MessageType } from "@/domain/message";
import { formatDate } from "@/utils/formatDate";
import styles from "./Message.module.css";

type Props = {
  message: MessageType;
};

export const Message = ({ message }: Props) => {
  const initial = message.user.name.trim().charAt(0) || "?";
  return (
    <article className={styles.card}>
      <div className={styles.userRow}>
        <div className={styles.avatar}>{initial}</div>
        <div>
          <span className={styles.name}>{message.user.name}</span>
          <span className={styles.userId}>@{message.user.id}</span>
        </div>
      </div>
      <p className={styles.body}>{message.body}</p>
      <div className={styles.date}>{formatDate(new Date(message.date), "HH:mm・YYYY年M月D日")}</div>
    </article>
  );
};
