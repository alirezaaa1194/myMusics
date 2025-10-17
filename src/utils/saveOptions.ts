import { optionsType } from "@/contexts/globalContent";

export function setOption(options: optionsType) {
  localStorage.setItem("options", JSON.stringify(options));
}
