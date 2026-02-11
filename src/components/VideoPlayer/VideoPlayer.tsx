import ReactPlayer from "react-player";
import { forwardRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play } from "lucide-react";
import styles from "./VideoPlayer.module.scss";

interface VideoPlayerProps {
  url: string;
  controls?: boolean;
  playing?: boolean;
  onPlayerProgress?: (state: { playedSeconds: number }) => void;
  onPlayerSeek?: (seconds: number) => void;
}

const VideoPlayer = forwardRef((props: VideoPlayerProps, ref) => {
  const {
    url,
    controls = true,
    playing = false,
    onPlayerProgress,
    onPlayerSeek,
  } = props;

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
              ref={ref as any}
              src={url}
              width="100%"
              height="100%"
              controls={controls}
              playing={playing}
              onTimeUpdate={onPlayerProgress as any}
              onSeeked={onPlayerSeek as any}
            />
          ) : (
            <Play size={32} color="snow" />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
});

export default VideoPlayer;
