import { ConfigProvider } from "antd";

import Chatbot from "./components/Chatbot";

import AppRouter from "./router";
import { appTheme } from "./theme";

function App() {
    return (
        <ConfigProvider theme={appTheme}>
            <AppRouter />
            <Chatbot />
        </ConfigProvider>
    );
}

export default App;