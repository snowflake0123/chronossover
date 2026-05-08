import { createContext, useState } from "react";
import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Start from "./pages/Start";
import Home from "./pages/Home";
import ViewMessage from "./pages/ViewMessage";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";
import { Message } from "./data/messages";

setupIonicReact();

type Context = {
  openaiApiKey: {
    state: string;
    setState: (value: string) => void;
  };
  targetYear: {
    state: number;
    setState: (value: number) => void;
  };
  messages: {
    state: Message[];
    setState: (messages: Message[]) => void;
  };
};

export const AppContext = createContext<Context>({} as Context);

const App: React.FC = () => {
  const [openaiApiKey, setOpenaiApiKey] = useState<string>("");
  const [targetYear, setTargetYear] = useState<number>(
    new Date().getFullYear()
  );
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <IonApp>
      <AppContext.Provider
        value={{
          openaiApiKey: { state: openaiApiKey, setState: setOpenaiApiKey },
          targetYear: { state: targetYear, setState: setTargetYear },
          messages: { state: messages, setState: setMessages },
        }}
      >
        <IonReactRouter>
          <IonRouterOutlet>
            <Route path="/" exact={true}>
              <Start />
            </Route>
            <Route path="/home" exact={true}>
              <Home />
            </Route>
            <Route path="/message/:id">
              <ViewMessage />
            </Route>
          </IonRouterOutlet>
        </IonReactRouter>
      </AppContext.Provider>
    </IonApp>
  );
};

export default App;
