import { useState } from "react";
import AddressSearch from "./components/AddressSearch/AddressSearch";
import Map from "./components/Map/Map";
import styles from "./App.module.css";

function App() {
  const [selectedAddress, setSelectedAddress] = useState("");

  const handleSearch = () => {
    // Просто вызываем поиск с текущим адресом
    console.log("Поиск адреса:", selectedAddress);
  };

  return (
    <div className={styles.app}>
      <h1 className={styles.title}>Поиск адреса на карте</h1>
      
      <div className={styles.searchSection}>
        <AddressSearch onSelect={setSelectedAddress} />
        <button className={styles.button} onClick={handleSearch}>
          Поиск
        </button>
      </div>

      <Map address={selectedAddress} />
    </div>
  );
}

export default App;
