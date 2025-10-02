import { Button } from "../ui/button";
import GlobalContext from "@/contexts/globalContent";
import { use, useEffect, useState } from "react";
import { setOption } from "@/actions/options";
import { Slider } from "../ui/slider";

function VolumeSliderComp() {
  const globalContext = use(GlobalContext);
  const [volume, setVolume] = useState(Number(globalContext?.options.volume));
  const [prevVolume, setPrevVolume] = useState(globalContext?.audio.current?.volume || 0.5);

  useEffect(() => {
    const muteHandler = (e: KeyboardEvent) => {
      if (e.key === "m") {
        if (globalContext?.audio.current) {
          if (globalContext.audio.current.volume > 0) {
            setVolume(0);
            globalContext.audio.current.volume = 0;
          } else {
            setVolume(50);
            globalContext.audio.current.volume = 0.5;
          }
        }
      }
    };

    window.addEventListener("keyup", muteHandler);

    return () => {
      window.removeEventListener("keyup", muteHandler);
    };
  }, [globalContext?.audio]);

  return (
    <div className="w-2/12 shrink-0 flex items-center gap-2">
      <Button
        className="w-10 h-10 cursor-pointer !bg-transparent !size-6"
        onClick={() => {
          if (globalContext?.audio.current) {
            setPrevVolume(globalContext.audio.current.volume || 0.5);
            if (globalContext?.options.volume) {
              globalContext.audio.current.volume = 0;
              setOption({ ...globalContext.options, volume: 0 });
              globalContext?.setOptions({ ...globalContext.options, volume: 0 });
              setVolume(0);
            } else {
              globalContext.audio.current.volume = Number(prevVolume);
              setOption({ ...globalContext.options, volume: Number(prevVolume) * 100 });
              globalContext?.setOptions({ ...globalContext.options, volume: Number(prevVolume) * 100 });
              setVolume(Number(prevVolume) * 100);
            }
          }
        }}
      >
        {volume ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM18.584 5.106a.75.75 0 0 1 1.06 0c3.808 3.807 3.808 9.98 0 13.788a.75.75 0 0 1-1.06-1.06 8.25 8.25 0 0 0 0-11.668.75.75 0 0 1 0-1.06Z" />
            <path d="M15.932 7.757a.75.75 0 0 1 1.061 0 6 6 0 0 1 0 8.486.75.75 0 0 1-1.06-1.061 4.5 4.5 0 0 0 0-6.364.75.75 0 0 1 0-1.06Z" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-5">
            <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.318.664-2.66 1.905A9.76 9.76 0 0 0 1.5 12c0 .898.121 1.768.35 2.595.341 1.24 1.518 1.905 2.659 1.905h1.93l4.5 4.5c.945.945 2.561.276 2.561-1.06V4.06ZM17.78 9.22a.75.75 0 1 0-1.06 1.06L18.44 12l-1.72 1.72a.75.75 0 1 0 1.06 1.06l1.72-1.72 1.72 1.72a.75.75 0 1 0 1.06-1.06L20.56 12l1.72-1.72a.75.75 0 1 0-1.06-1.06l-1.72 1.72-1.72-1.72Z" />
          </svg>
        )}
      </Button>
      <Slider
        defaultValue={[100 - Number(globalContext?.options.volume)]}
        value={[Number(100 - volume)]}
        onValueChange={(e) => {
          if (globalContext?.audio.current) {
            globalContext.audio.current.volume = (100 - e[0]) / 100;
            setVolume(100 - e[0]);
          }
        }}
        onValueCommit={(e) => {
          if (globalContext) {
            setOption({ ...globalContext.options, volume: 100 - e[0] });
            globalContext?.setOptions({ ...globalContext.options, volume: 100 - e[0] });
          }
        }}
        max={100}
        step={1}
        dir="rtl"
        className="cursor-pointer"
      />
    </div>
  );
}

export default VolumeSliderComp;
