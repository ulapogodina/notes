import { useState, useEffect, useRef } from "react";
import styles from "./AddressSearch.module.css";

interface Props {
  onSelect: (address: string) => void;
}

export default function AddressSearch({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Получение подсказок от DaData
  useEffect(() => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    const fetchSuggestions = async () => {
      try {
        const response = await fetch(
          "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              Authorization: `Token ${import.meta.env.VITE_DADATA_API_KEY}`,
            },
            body: JSON.stringify({ query }),
          }
        );

        const data = await response.json();
        setSuggestions(data.suggestions?.map((s: any) => s.value) || []);
      } catch (error) {
        console.error("Ошибка при получении подсказок:", error);
      }
    };

    const timer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Закрытие подсказок при клике вне компонента
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (address: string) => {
    setQuery(address);
    setSuggestions([]);
    setShowSuggestions(false);
    onSelect(address);
  };

  return (
    <div className={styles.container} ref={wrapperRef}>
      <input
        type="text"
        className={styles.input}
        placeholder="Введите адрес"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => setShowSuggestions(true)}
      />
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className={styles.suggestions}>
          {suggestions.map((address, index) => (
            <li key={index} onClick={() => handleSelect(address)}>
              {address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
