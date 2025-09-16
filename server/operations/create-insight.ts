import type { Insight } from "$models/insight.ts";
import type { HasDBClient } from "../shared.ts";
import * as insightsTable from "$tables/insights.ts";

type Input = HasDBClient & {
  brand: number;
  text: string;
};

export default (input: Input): Insight => {
  console.log(`Creating insight for brand=${input.brand}...`);

  // Prepare the data to insert into the database
  const createdAt = new Date().toISOString();

  const insightData: insightsTable.Insert = {
    brand: input.brand,
    createdAt,
    text: input.text,
  };

  // Insert the new insight into the database
  input.db.exec(insightsTable.insertStatement(insightData));

  // Retrieve the newly created insight (with auto-generated ID)
  const [row] = input.db.sql<
    insightsTable.Row
  >`SELECT * FROM insights ORDER BY id DESC LIMIT 1`;

  // Convert the database row to the proper Insight format
  const result = {
    ...row,
    createdAt: new Date(row.createdAt),
  };

  console.log("Insight created:", result);
  return result;
};
