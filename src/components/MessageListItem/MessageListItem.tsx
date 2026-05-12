import { Link } from "react-router-dom";
import type { Message } from "@/domain/message";
import { formatDate } from "@/utils/formatDate";
import styles from "./MessageListItem.module.css";

type Props = {
  message: Message;
};

export const MessageListItem = ({ message }: Props) => {
  const initial = message.user.name.trim().charAt(0) || "?";
  return (
    <Link to={`/message/${message.id}`} className={styles.item}>
      <div className={styles.avatar}>{initial}</div>
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.name}>{message.user.name}</span>
          <span className={styles.userId}>@{message.user.id}</span>
          <span className={styles.date}>{formatDate(new Date(message.date))}</span>
        </div>
        <p className={styles.body}>{message.body}</p>
      </div>
    </Link>
  );
};
