window.KARENApp = window.KARENApp || {};

(function renderKaren(app) {
  const App = app.App;
  const container = document.getElementById("root");

  if (ReactDOM.createRoot) {
    const root = ReactDOM.createRoot(container);
    root.render(<App />);
    return;
  }

  ReactDOM.render(<App />, container);
})(window.KARENApp);
