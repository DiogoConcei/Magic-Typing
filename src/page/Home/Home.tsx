import { useNavigate } from "react-router";
import axios from "axios";
import { Loader2 } from "lucide-react";
import VideoPlayer from "../../components/VideoPlayer/VideoPlayer";
import useGlobalStore from "../../store/globalStore";
import Loading from "../../components/Loading/Loading";
import styles from "./Home.module.scss";

export default function Home() {
  const url = useGlobalStore((s) => s.url);
  const setUrl = useGlobalStore((s) => s.setUrl);
  const isLoading = useGlobalStore((s) => s.isLoading);
  const setIsLoading = useGlobalStore((s) => s.setIsLoading);
  const setTranscription = useGlobalStore((s) => s.setTranscription);
  const nav = useNavigate();

  const sendVideo = async () => {
    if (!url) return;

    setIsLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/api/video", {
        url,
      });

      console.log(`Dados: `, response.data.segments);
      setTranscription(response.data.segments);
      nav("/typing-game");
    } catch (e) {
      alert("Erro ao transcrever o vídeo");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <>
      <VideoPlayer url={url} />
      <div className={styles["url-container"]}>
        <input
          type="text"
          placeholder="url do video"
          onChange={(e) => setUrl(e.target.value)}
        />
        <button disabled={isLoading} onClick={sendVideo}>
          {isLoading ? (
            <>
              <Loader2 className={styles["animate-spin"]} size={16} />
              Processando...
            </>
          ) : (
            "Transcrever"
          )}
        </button>
      </div>
    </>
  );
}
