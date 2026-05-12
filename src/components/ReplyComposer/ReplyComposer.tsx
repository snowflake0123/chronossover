import { useState, type ChangeEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/Button/Button";
import styles from "./ReplyComposer.module.css";

type Props = {
  disabled?: boolean;
  onSubmit: (body: string) => void;
};

export const ReplyComposer = ({ disabled, onSubmit }: Props) => {
  const [value, setValue] = useState("");

  const handleChange = (e: ChangeEvent<HTMLTextAreaElement>) => setValue(e.target.value);

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSubmit(trimmed);
    setValue("");
  };

  const handleKey = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <div className={styles.composer}>
      <textarea
        className={styles.textarea}
        placeholder="返信を入力"
        value={value}
        disabled={disabled}
        onChange={handleChange}
        onKeyDown={handleKey}
        rows={1}
      />
      <Button variant="primary" disabled={disabled || value.trim().length === 0} onClick={submit}>
        送信
      </Button>
    </div>
  );
};
