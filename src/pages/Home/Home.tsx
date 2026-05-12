import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { AppHeader } from "@/components/AppHeader/AppHeader";
import { Button } from "@/components/Button/Button";
import { MessageListItem } from "@/components/MessageListItem/MessageListItem";
import { ProgressBar } from "@/components/ProgressBar/ProgressBar";
import { Spinner } from "@/components/Spinner/Spinner";
import { YearPicker } from "@/components/YearPicker/YearPicker";
import { MissingEnvError } from "@/config/env";
import { parseRawResponseToMessages } from "@/domain/message";
import { fetchComments, fetchTrends } from "@/services/openai";
import { useAppContext } from "@/state/AppContext";
import styles from "./Home.module.css";

const PULL_THRESHOLD = 110;
const PULL_MAX = 160;
const PULL_DAMPING = 0.45;
const WHEEL_DAMPING = 0.14;
const WHEEL_IDLE_MS = 220;
const REFRESHING_HEIGHT = 56;

const Home = () => {
  const { messages, setMessages, targetYear, setTargetYear, trends, setTrends } = useAppContext();

  const [pendingYear, setPendingYear] = useState<number>(targetYear);
  const [isRegenerating, setIsRegenerating] = useState(false);

  const [pullDistance, setPullDistance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isPulling, setIsPulling] = useState(false);

  const touchStartYRef = useRef<number | null>(null);
  const pullDistRef = useRef(0);
  const restoreHeightRef = useRef<number | null>(null);
  const isRefreshingRef = useRef(false);
  const isRegeneratingRef = useRef(false);

  useEffect(() => {
    isRefreshingRef.current = isRefreshing;
  }, [isRefreshing]);

  useEffect(() => {
    isRegeneratingRef.current = isRegenerating;
  }, [isRegenerating]);

  const triggerRefresh = useCallback(async () => {
    if (isRefreshingRef.current) return;
    if (isRegeneratingRef.current) return;
    if (!trends) return;
    setIsRefreshing(true);
    try {
      const raw = await fetchComments({ year: targetYear, trends });
      const more = parseRawResponseToMessages(raw);
      if (more.length === 0) return;
      restoreHeightRef.current = document.documentElement.scrollHeight;
      setMessages([...more, ...messages]);
    } catch (error) {
      if (error instanceof MissingEnvError) {
        window.alert("環境変数 VITE_OPENAI_API_KEY が未設定です。.env.local を確認してください。");
      } else {
        window.alert("OpenAI API との通信に失敗しました。時間をおいてから再度試してください。");
      }
      console.error(error);
    } finally {
      setIsRefreshing(false);
    }
  }, [targetYear, trends, messages, setMessages]);

  const handleRegenerate = async () => {
    if (isRegeneratingRef.current) return;
    if (!Number.isFinite(pendingYear)) return;

    setIsRegenerating(true);
    const mode: "past" | "future" = new Date().getFullYear() >= pendingYear ? "past" : "future";

    try {
      const fetchedTrends = await fetchTrends({ year: pendingYear, mode });
      const fetchedComments = await fetchComments({ year: pendingYear, trends: fetchedTrends });
      const parsed = parseRawResponseToMessages(fetchedComments);
      setTrends(fetchedTrends);
      setTargetYear(pendingYear);
      setMessages(parsed);
    } catch (error) {
      if (error instanceof MissingEnvError) {
        window.alert("環境変数 VITE_OPENAI_API_KEY が未設定です。.env.local を確認してください。");
      } else {
        window.alert("OpenAI API との通信に失敗しました。時間をおいてから再度試してください。");
      }
      console.error(error);
    } finally {
      setIsRegenerating(false);
    }
  };

  useLayoutEffect(() => {
    if (restoreHeightRef.current == null) return;
    const prevHeight = restoreHeightRef.current;
    const delta = document.documentElement.scrollHeight - prevHeight;
    if (delta > 0) {
      window.scrollBy(0, delta);
    }
    restoreHeightRef.current = null;
  }, [messages]);

  useEffect(() => {
    let wheelIdleTimer: number | null = null;

    const finishPull = () => {
      const dist = pullDistRef.current;
      pullDistRef.current = 0;
      setPullDistance(0);
      setIsPulling(false);
      if (dist >= PULL_THRESHOLD) {
        void triggerRefresh();
      }
    };

    const cancelPull = () => {
      pullDistRef.current = 0;
      setPullDistance(0);
      setIsPulling(false);
    };

    const onTouchStart = (e: TouchEvent) => {
      if (window.scrollY > 0 || isRefreshingRef.current || isRegeneratingRef.current) return;
      touchStartYRef.current = e.touches[0]?.clientY ?? null;
      pullDistRef.current = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchStartYRef.current == null) return;
      if (isRegeneratingRef.current) return;
      const clientY = e.touches[0]?.clientY;
      if (clientY == null) return;
      const raw = clientY - touchStartYRef.current;
      if (raw <= 0) {
        cancelPull();
        return;
      }
      const damped = Math.min(raw * PULL_DAMPING, PULL_MAX);
      pullDistRef.current = damped;
      setPullDistance(damped);
      setIsPulling(true);
      if (e.cancelable) e.preventDefault();
    };
    const onTouchEnd = () => {
      touchStartYRef.current = null;
      finishPull();
    };

    const onWheel = (e: WheelEvent) => {
      if (isRefreshingRef.current || isRegeneratingRef.current) return;
      if (window.scrollY > 0) return;
      if (e.deltaY >= 0) {
        if (pullDistRef.current > 0) cancelPull();
        return;
      }
      if (e.cancelable) e.preventDefault();
      const add = -e.deltaY * WHEEL_DAMPING;
      const next = Math.min(pullDistRef.current + add, PULL_MAX);
      pullDistRef.current = next;
      setPullDistance(next);
      setIsPulling(true);

      if (wheelIdleTimer != null) window.clearTimeout(wheelIdleTimer);
      wheelIdleTimer = window.setTimeout(() => {
        wheelIdleTimer = null;
        finishPull();
      }, WHEEL_IDLE_MS);
    };

    document.addEventListener("touchstart", onTouchStart, { passive: true });
    document.addEventListener("touchmove", onTouchMove, { passive: false });
    document.addEventListener("touchend", onTouchEnd);
    document.addEventListener("touchcancel", onTouchEnd);
    document.addEventListener("wheel", onWheel, { passive: false });
    return () => {
      document.removeEventListener("touchstart", onTouchStart);
      document.removeEventListener("touchmove", onTouchMove);
      document.removeEventListener("touchend", onTouchEnd);
      document.removeEventListener("touchcancel", onTouchEnd);
      document.removeEventListener("wheel", onWheel);
      if (wheelIdleTimer != null) window.clearTimeout(wheelIdleTimer);
    };
  }, [triggerRefresh]);

  const indicatorHeight = isRefreshing ? REFRESHING_HEIGHT : pullDistance;
  const indicatorReady = pullDistance >= PULL_THRESHOLD || isRefreshing;
  const isDirty =
    Number.isFinite(pendingYear) &&
    (pendingYear !== targetYear || messages.length === 0 || isRegenerating);

  return (
    <div className={styles.page}>
      <AppHeader
        title={
          <span className={styles.titleRow}>
            <span className={styles.titleLead}>Timeline in</span>
            <span className={styles.yearAnchor}>
              <YearPicker
                size="md"
                hideLabel
                value={pendingYear}
                onChange={setPendingYear}
                disabled={isRegenerating}
                inputClassName={styles.titleYearInput}
              />
              <span
                className={`${styles.updateFly} ${isDirty ? styles.updateFlyVisible : ""}`}
                aria-hidden={!isDirty}
              >
                <Button
                  variant="primary"
                  className={styles.titleUpdateButton}
                  onClick={handleRegenerate}
                  disabled={isRegenerating || !Number.isFinite(pendingYear)}
                  tabIndex={isDirty ? 0 : -1}
                >
                  {isRegenerating ? "更新中…" : "更新"}
                </Button>
              </span>
            </span>
          </span>
        }
      />
      {isRegenerating ? <ProgressBar /> : null}
      <div
        className={`${styles.pullArea} ${isPulling ? "" : styles.pullAreaAnimated}`}
        style={{ height: indicatorHeight }}
        aria-hidden={!isRefreshing}
      >
        {indicatorReady ? <Spinner /> : null}
      </div>
      <div
        className={`${styles.list} ${isRegenerating ? styles.listDisabled : ""}`}
        aria-disabled={isRegenerating}
      >
        {messages.length === 0 ? (
          <p className={styles.empty}>
            まだタイムラインがありません。年を選んで「更新」してください。
          </p>
        ) : (
          messages.map((m) => <MessageListItem key={m.id} message={m} />)
        )}
      </div>
    </div>
  );
};

export default Home;
