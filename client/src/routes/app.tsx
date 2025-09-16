import { useEffect, useState } from "react";
import { Header } from "../components/header/header.tsx";
import { Insights } from "../components/insights/insights.tsx";
import styles from "./app.module.css";
import type { Insight } from "../schemas/insight.ts";

export const App = () => {
  // Bugfix: was declaring single Insight but initialising with array
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(`/api/insights`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch insights: ${response.status}`);
        }
        
        const insights = await response.json();
        setInsights(insights);
      } catch (error) {
        console.error("Failed to load insights:", error);
      }
    })();
  }, []);

  return (
    <main className={styles.main}>
      <Header />
      <Insights className={styles.insights} insights={insights} />
    </main>
  );
};
