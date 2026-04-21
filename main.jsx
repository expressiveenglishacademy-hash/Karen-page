window.KARENApp = window.KARENApp || {};

(function renderKaren(app) {
  const App = app.App;
  const root = ReactDOM.createRoot(document.getElementById("root"));

  root.render(<App />);
})(window.KARENApp);
