import ReactDOM from "react-dom/client";
import App from "./App/App";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./Store/Store";
import { SocketProvider } from "./Components/Common/SocketContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SocketProvider>
        <App />
      </SocketProvider>
    </PersistGate>
  </Provider>
);
