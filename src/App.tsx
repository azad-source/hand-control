import HandleClick from "./components/HandleClick/HandleClick";
import styles from "./App.module.scss";

function App() {
  return (
    <div className={styles.root}>
      <HandleClick devMode={false} />
    </div>
  );
}

export default App;
