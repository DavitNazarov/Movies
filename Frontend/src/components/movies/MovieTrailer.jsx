import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

const MovieTrailer = ({ trailer }) => {
  const containerRef = useRef(null);
  const [playerHeight, setPlayerHeight] = useState(null);

  useEffect(() => {
    if (!trailer || !containerRef.current) return;

    const el = containerRef.current;
    const updateDimensions = () => {
      const width = el.offsetWidth;
      if (width) {
        setPlayerHeight((width * 9) / 16);
      }
    };

    updateDimensions();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => updateDimensions())
        : null;

    resizeObserver?.observe(el);
    window.addEventListener("resize", updateDimensions);

    return () => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateDimensions);
    };
  }, [trailer?.key]);

  return (
    <>
      {trailer && (
        <motion.div
          className="mt-10 space-y-4"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold">Trailer</h2>
          <div className="w-full">
            <div
              ref={containerRef}
              className="relative w-full overflow-hidden rounded-2xl shadow-lg bg-black"
            >
              <iframe
                src={`https://www.youtube.com/embed/${trailer.key}`}
                title="Movie trailer"
                allowFullScreen
                loading="lazy"
                className="w-full"
                style={
                  playerHeight
                    ? { height: `${playerHeight}px` }
                    : { aspectRatio: "16 / 9" }
                }
              />
            </div>
          </div>
        </motion.div>
      )}
    </>
  );
};

export default MovieTrailer;
