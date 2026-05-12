import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { Button } from "@/components/Button/Button";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { YearPicker } from "@/components/YearPicker/YearPicker";
import { MissingEnvError } from "@/config/env";
import { parseRawResponseToMessages } from "@/domain/message";
import { fetchComments, fetchTrends } from "@/services/openai";
import { useAppContext } from "@/state/AppContext";
import styles from "./Start.module.css";

const Start = () => {
  const { targetYear, setTargetYear, setMessages, setTrends } = useAppContext();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleStart = async () => {
    if (!Number.isFinite(targetYear)) return;

    setLoading(true);
    const mode: "past" | "future" = new Date().getFullYear() >= targetYear ? "past" : "future";

    try {
      const fetchedTrends = await fetchTrends({ year: targetYear, mode });
      setTrends(fetchedTrends);

      const fetchedComments = await fetchComments({
        year: targetYear,
        trends: fetchedTrends,
      });
      const parsed = parseRawResponseToMessages(fetchedComments);
      setMessages(parsed);
      navigate("/home");
    } catch (error) {
      if (error instanceof MissingEnvError) {
        window.alert("環境変数 VITE_OPENAI_API_KEY が未設定です。.env.local を確認してください。");
      } else {
        window.alert("OpenAI API との通信に失敗しました。時間をおいてから再度試してください。");
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <AppHeader />
      {loading ? <ProgressBar /> : null}

      <section className={styles.hero}>
        <h1 className={styles.wordmark}>Chronossover</h1>
        <p className={styles.tagline}>Any year. Any voice.</p>
        <p className={styles.description}>
          西暦を選ぶだけで、その時代の日本の SNS タイムラインを生成します。
          <br />
          過去は記録から、未来は想像から。
        </p>
        <div className={styles.controls}>
          <div className={styles.row}>
            <YearPicker value={targetYear} onChange={setTargetYear} size="lg" />
          </div>
          <Button
            variant="storeHero"
            onClick={handleStart}
            disabled={loading || !Number.isFinite(targetYear)}
          >
            {loading ? "Chronossovering…" : "Chronossover!"}
          </Button>
        </div>
      </section>
    </div>
  );
};

export default Start;
