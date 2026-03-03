import { useEffect, useState, useCallback } from "react";
import { distance } from "fastest-levenshtein";
import useGlobalStore from "../../store/globalStore";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import Loading from "../../components/Loading/Loading";
import styles from "./TypingGame.module.scss";

const VIDEO_LIMIT = 32; // limite fixo em segundos

export default function TypingGame() {
  const transcription = useGlobalStore((s) => s.transcription);
  const url = useGlobalStore((s) => s.url);
  const currentIndex = useGlobalStore((s) => s.index);
  const setCurrentIndex = useGlobalStore((s) => s.setCurrentIndex);

  const [typed, setTyped] = useState<string>("");
  const [submittedPhrases, setSubmittedPhrases] = useState<string[]>([]);
  const [score, setScore] = useState<number>(0);

  const getCharFeedback = (typed: string, target: string) => {
    return typed.split("").map((char, i) => ({
      char,
      status:
        char.toLowerCase() === target[i].toLowerCase() ? "correct" : "wrong",
    }));
  };

  const calcScore = (typed: string, target: string): number => {
    const maxLen = Math.max(typed.length, target.length);
    if (maxLen === 0) return 100;

    const dist = distance(typed.trim(), target.trim());
    const similarity = 1 - dist / maxLen; // 0 a 1
    return Math.round(similarity * 100); // 0 a 100
  };

  const handleMatch = useCallback(() => {
    const segment = transcription[currentIndex];
    if (!segment) return;

    if (typed.trim().length > 0) {
      const score = calcScore(typed, segment.text); // ◄ score da frase
      setSubmittedPhrases((p) => [typed.trim(), ...p]);
      setScore((prev) => prev + score);
    }

    setTyped("");
    setCurrentIndex(currentIndex + 1);
  }, [typed, currentIndex, transcription, setCurrentIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setTyped((prev) => prev + e.key);
      }

      if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1));
      }

      if (e.key === "Enter") handleMatch();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleMatch]);

  if (!transcription) return <Loading />;

  // const unlockedTranscription = transcription.filter(
  //   (segment: any) => segment.end <= VIDEO_LIMIT,
  // );

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h2 className={styles.title}>Magic Typing</h2>
          <div className={styles.score}>
            Pontos acumulados: <span>{score}</span>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.upset}>
            <aside className={styles.videoAside}>
              <div className={styles.videoCard}>
                <div>
                  <VideoPlayer url={url} />
                </div>

                <div className={styles["video-text"]}>
                  <div className={styles.timeBadge}>
                    Limite de vídeo: {VIDEO_LIMIT}s
                  </div>

                  <div className={styles.videoHint}>
                    Dica: digite no teclado e pressione <span>Enter</span> para
                    enviar.
                  </div>
                </div>
              </div>
            </aside>

            <section className={styles.content}>
              <div className={`${styles.card} ${styles.sentences}`}>
                <ul className={styles.list}>
                  {transcription.map(
                    (s, i) =>
                      i >= currentIndex && (
                        <li
                          key={i}
                          className={`${styles.sentenceItem} ${
                            i === currentIndex
                              ? styles.current
                              : i < currentIndex
                                ? styles.done
                                : ""
                          }`}
                        >
                          <div className={styles.index}>{i + 1}</div>
                          <div style={{ flex: 1 }}>{s.text}</div>
                          <div className={styles.time}>
                            {Math.round(s.start)}s
                          </div>
                        </li>
                      ),
                  )}
                </ul>
              </div>
            </section>
          </div>

          <div className={styles.down}>
            <div className={`${styles.card} ${styles.typedBox}`}>
              <div className={styles.typedList}>
                {submittedPhrases.length === 0 ? (
                  <div className={styles.empty}>
                    Nenhuma frase enviada ainda — digite e pressione Enter.
                  </div>
                ) : (
                  submittedPhrases.map((p, i) => (
                    <div key={i} className={styles.typedPhrase}>
                      {p}
                    </div>
                  ))
                )}
              </div>

              <div className={styles.preview}>
                <div className={styles.previewBox}>
                  <div className={styles.previewChars}>
                    {getCharFeedback(
                      typed,
                      transcription[currentIndex]?.text ?? "",
                    ).map((c, i) => (
                      <span
                        key={i}
                        className={
                          c.status === "correct" ? styles.correct : styles.wrong
                        }
                      >
                        {c.char === " " ? "\u00A0" : c.char}
                      </span>
                    ))}
                    <span className={styles.caret} />
                  </div>{" "}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
