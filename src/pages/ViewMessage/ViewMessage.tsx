import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { Message as MessageView } from "@/components/Message/Message";
import { ReplyComposer } from "@/components/ReplyComposer/ReplyComposer";
import { Spinner } from "@/components/Spinner/Spinner";
import { MissingEnvError } from "@/config/env";
import { findMessageById, type Message as MessageType } from "@/domain/message";
import { fetchReply } from "@/services/openai";
import { useAppContext } from "@/state/AppContext";
import styles from "./ViewMessage.module.css";

const REPLY_DELAY_MS = 2000;
const REPLY_INTERVAL_MS = 60 * 1000;

const createReplyDate = (rootDate: string, replyPosition: number): string => {
  const rootTime = Date.parse(rootDate);
  if (!Number.isFinite(rootTime)) return rootDate;
  return new Date(rootTime + REPLY_INTERVAL_MS * replyPosition).toISOString();
};

const ViewMessage = () => {
  const { messages, targetYear } = useAppContext();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [root, setRoot] = useState<MessageType | undefined>(undefined);
  const [replies, setReplies] = useState<MessageType[]>([]);
  const [isReplying, setIsReplying] = useState(false);
  const notifiedRef = useRef(false);

  useEffect(() => {
    if (!id) {
      navigate("/");
      return;
    }
    const found = findMessageById(messages, id);
    if (!found) {
      if (!notifiedRef.current) {
        notifiedRef.current = true;
        window.alert("メッセージが見つかりませんでした");
      }
      navigate("/");
      return;
    }
    setRoot(found);
  }, [id, messages, navigate]);

  const handleSubmit = (body: string) => {
    if (!root) return;
    const yourReply: MessageType = {
      id: uuidv4(),
      user: { id: "you", name: "You" },
      date: new Date().toISOString(),
      body,
    };
    const nextReplies = [...replies, yourReply];
    setReplies(nextReplies);

    window.setTimeout(async () => {
      setIsReplying(true);
      try {
        const text = await fetchReply({
          year: targetYear,
          message: root,
          prevReplies: nextReplies,
        });
        const aiReply: MessageType = {
          id: uuidv4(),
          user: root.user,
          date: createReplyDate(root.date, nextReplies.length + 1),
          body: text,
        };
        setReplies((prev) => [...prev, aiReply]);
      } catch (error) {
        if (error instanceof MissingEnvError) {
          window.alert(
            "環境変数 VITE_OPENAI_API_KEY が未設定です。.env.local を確認してください。",
          );
        } else {
          window.alert("OpenAI API との通信に失敗しました。時間をおいてから再度試してください。");
        }
        console.error(error);
      } finally {
        setIsReplying(false);
      }
    }, REPLY_DELAY_MS);
  };

  return (
    <div className={styles.page}>
      <AppHeader title="Post" back={{ to: "/home", label: `Timeline in ${targetYear}` }} />
      <div className={styles.thread}>
        {root ? (
          <>
            <MessageView message={root} />
            {replies.map((r) => (
              <MessageView key={r.id} message={r} />
            ))}
            {isReplying ? (
              <div className={styles.spinnerRow}>
                <Spinner />
              </div>
            ) : null}
          </>
        ) : (
          <p className={styles.notFound}>メッセージを読み込み中…</p>
        )}
      </div>
      <ReplyComposer disabled={!root || isReplying} onSubmit={handleSubmit} />
    </div>
  );
};

export default ViewMessage;
