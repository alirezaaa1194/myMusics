import GlobalContext from "@/contexts/globalContent";
import { use, useEffect, useState } from "react";
import { Slider } from "../ui/slider";
import { useCurrentMusic } from "@/hooks/useMusic";

function TimelineComp() {
  const globalContext = use(GlobalContext);
  const audioDuration = globalContext?.audio.current?.duration;
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const currentMusic = useCurrentMusic();

  useEffect(() => {
    if (currentMusic && globalContext?.audio.current) {
      if (!globalContext?.audio.current.src) {
        globalContext.audio.current.src = currentMusic.src;
      }
    }

    const setTime = () => {
      setAudioCurrentTime(globalContext?.audio.current?.currentTime || 0);
    };
    globalContext?.audio.current?.addEventListener("timeupdate", setTime);

    return () => {
      globalContext?.audio.current?.removeEventListener("timeupdate", setTime);
    };
    // }, []);
  }, [currentMusic, globalContext?.audio]);

  return (
    <>
      <Slider
        value={audioDuration ? [100 - (Number(audioCurrentTime) / Number(audioDuration)) * 100] : [100]}
        onValueChange={(e) => {
          if (globalContext?.audio.current) {
            globalContext.audio.current.currentTime = ((100 - e[0]) / 100) * Number(audioDuration);
          }
        }}
        max={100}
        step={1}
        dir="rtl"
        className="cursor-pointer"
      />
      <div className="w-full flex items-center justify-between px-3">
        <span className="text-sm text-white lg:text-secondary">
          {String((Number(audioCurrentTime) / 60).toFixed(0)).padStart(2, "0")}:{String((Number(audioCurrentTime) % 60).toFixed(0)).padStart(2, "0")}
        </span>
        <span className="text-sm text-white lg:text-secondary">
          {audioDuration ? (
            <>
              {String((Number(audioDuration) / 60).toFixed(0)).padStart(2, "0")}:{String((Number(audioDuration) % 60).toFixed(0)).padStart(2, "0")}
            </>
          ) : (
            "00:00"
          )}
        </span>
      </div>
    </>
  );
}

export default TimelineComp;
