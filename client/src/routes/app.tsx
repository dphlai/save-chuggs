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
      const res = await fetch(`/api/insights`);
      setInsights(await res.json());
    })();
  }, []);

  return (
    <main className={styles.main}>
      <Header />
      <Insights className={styles.insights} insights={insights} />
    </main>
  );
};
