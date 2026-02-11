import { useEffect, useRef, useState } from "react";
import useGlobalStore from "../../store/globalStore";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import Loading from "../../components/Loading/Loading";
import styles from "./Typing.module.scss";

export default function TypingGame() {
  const transcription = useGlobalStore((s) => s.transcription);
  const url = useGlobalStore((s) => s.url);
  const currentIndex = useGlobalStore((s) => s.index);
  const setCurrentIndex = useGlobalStore((s) => s.setCurrentIndex);
  const maxUnlockedTime = useGlobalStore((s) => s.maxUnlockedTime);
  const setMaxTime = useGlobalStore((s) => s.setMaxUnlockedTime);

  const [typed, setTyped] = useState<string>("");
  const [submittedPhrases, setSubmittedPhrases] = useState<string[]>([]);

  const playerRef = useRef<any>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
        setTyped((prev) => prev + e.key);
      }

      if (e.key === "Backspace") {
        setTyped((prev) => prev.slice(0, -1));
      }

      if (e.key === "Enter") {
        if (typed.trim().length > 0) {
          setSubmittedPhrases((p) => [typed.trim(), ...p]);
        }

        setTyped("");

        const segment = transcription[currentIndex];
        if (!segment) return;

        setMaxTime(segment.end);

        setCurrentIndex(currentIndex + 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex, transcription, typed, setCurrentIndex, setMaxTime]);

  if (!transcription) return <Loading />;

  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <header className={styles.header}>
          <h2 className={styles.title}>Magic Typing</h2>
          <div className={styles.score}>
            Pontos acumulados: <span>0</span>
          </div>
        </header>

        <main className={styles.main}>
          <div className={styles.upset}>
            <aside className={styles.videoAside}>
              <div className={styles.videoCard}>
                <div>
                  <VideoPlayer
                    ref={playerRef}
                    url={url}
                    controls={false}
                    playing
                    onPlayerProgress={(state: any) => {
                      if (!playerRef.current) return;
                      if (state.playedSeconds > maxUnlockedTime + 0.25) {
                        playerRef.current.seekTo(maxUnlockedTime, "seconds");
                      }
                    }}
                  />
                </div>

                <div className={styles["video-text"]}>
                  <div className={styles.timeBadge}>
                    Tempo desbloqueado: {Math.round(maxUnlockedTime)}s
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
                  {transcription.map((s: any, i: number) => (
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
                      <div className={styles.time}>{Math.round(s.start)}s</div>
                    </li>
                  ))}
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
                    {typed.split("").map((c, i) => (
                      <span key={i} className={styles.char}>
                        {c === " " ? "\u00A0" : c}
                      </span>
                    ))}
                    <span className={styles.caret} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
