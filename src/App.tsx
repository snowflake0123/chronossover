import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppProvider } from "@/state/AppContext";
import Start from "@/pages/Start/Start";
import Home from "@/pages/Home/Home";
import ViewMessage from "@/pages/ViewMessage/ViewMessage";

const App = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Start />} />
          <Route path="/home" element={<Home />} />
          <Route path="/message/:id" element={<ViewMessage />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;
