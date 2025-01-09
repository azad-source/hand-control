import HandControl from "./components/HandControl/HandControl";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.root}>
      <HandControl devMode={true} />
    </div>
  );
}

export default App;
