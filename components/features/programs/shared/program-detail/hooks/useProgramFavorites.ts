import { useEffect, useRef, useState } from "react";
import useProgramStore from "@/store/programsStore";
import { useShallow } from "zustand/react/shallow";

export function useProgramFavorites(programGuid: string, initialIsFavorite: boolean) {
  const { addProgramToFavorite, removeProgramFromFavorite } = useProgramStore(
    useShallow((s) => ({
      addProgramToFavorite: s.addProgramToFavorite,
      removeProgramFromFavorite: s.removeProgramFromFavorite,
    }))
  );

  const [isFavorites, setIsFavorites] = useState(initialIsFavorite);
  const isMounted = useRef(false);

  useEffect(() => {
    if (!isMounted.current) {
      isMounted.current = true;
      return;
    }
    if (isFavorites) {
      addProgramToFavorite(programGuid);
    } else {
      removeProgramFromFavorite(programGuid);
    }
  }, [isFavorites]);

  return { isFavorites, setIsFavorites };
}
