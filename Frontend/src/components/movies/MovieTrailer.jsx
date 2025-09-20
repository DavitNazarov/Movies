import { motion } from "framer-motion";

const MovieTrailer = ({ trailer }) => {
  return (
    <>
      {trailer && (
        <motion.div
          className="mt-10"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-bold mb-4">
            Trailer
          </h2>
          <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg">
            <iframe
              src={`https://www.youtube.com/embed/${trailer.key}`}
              title="Trailer"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </motion.div>
      )}
    </>
  );
};

export default MovieTrailer;
