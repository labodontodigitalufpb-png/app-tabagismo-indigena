import { Component, StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: "24px", fontFamily: "system-ui, sans-serif" }}>
          <h2>Erro ao carregar a aplicação</h2>
          <p>Abra o console do navegador (F12) e compartilhe a mensagem abaixo:</p>
          <pre
            style={{
              whiteSpace: "pre-wrap",
              background: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "12px",
            }}
          >
            {String(this.state.error?.message || this.state.error)}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Elemento #root não encontrado no index.html");
}

createRoot(rootElement).render(
  <StrictMode>
    <AppErrorBoundary>
      <App />
    </AppErrorBoundary>
  </StrictMode>
);
