import { ToastContainer } from "react-toastify";
import { AppRoutes } from "./routes/routes.index";
import { ScrollArea } from "@/components/ui/scroll-area";

function App() {
  return (
    <>
      <AppRoutes />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}
export default App;
