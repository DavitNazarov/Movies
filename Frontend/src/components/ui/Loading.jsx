import { ScaleLoader } from "react-spinners";

const Loading = () => {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <ScaleLoader color="#000" />
    </div>
  );
};

export default Loading;
