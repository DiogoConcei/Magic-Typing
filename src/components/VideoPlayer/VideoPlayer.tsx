import ReactPlayer from "react-player";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import styles from "./VideoPlayer.module.scss";

export default function VideoPlayer({ url }: { url: string }) {
  const ANIM = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.4 },
  };

  return (
    <div className={styles["player-container"]}>
      <AnimatePresence mode="wait">
        <motion.div
          key={url ? "player" : "placeholder"}
          {...ANIM}
          className={styles["player-inner"]}
        >
          {url ? (
            <ReactPlayer
              src={url}
              width="100%"
              height="100%"
              className={styles["player-inner"]}
            />
          ) : (
            <Play size={32} color="snow" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
