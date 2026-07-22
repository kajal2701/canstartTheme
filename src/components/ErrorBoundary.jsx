import React from "react";

// App-level error boundary — a render crash otherwise unmounts the whole tree
// and leaves a blank white screen with no clue what happened.
class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("ErrorBoundary caught:", error, info?.componentStack);
  }

  render() {
    if (this.state.error) {
      return (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 999999,
            background: "#fff",
            color: "#111",
            padding: "16px",
            overflow: "auto",
            fontFamily: "monospace",
            fontSize: "12px",
            whiteSpace: "pre-wrap",
          }}
        >
          <strong>App crashed:</strong>
          {"\n\n"}
          {String(this.state.error?.message || this.state.error)}
          {"\n\n"}
          {this.state.error?.stack || ""}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
