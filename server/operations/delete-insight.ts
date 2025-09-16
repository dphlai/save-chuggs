import type { HasDBClient } from "../shared.ts";

type Input = HasDBClient & {
  id: number;
};

export default (input: Input): boolean => {
  console.log(`Deleting insight with id=${input.id}`);

  // Attempt to delete the insight from the database
  const result = input.db.exec(`DELETE FROM insights WHERE id = ${input.id}`);

  // Check if any rows were affected (deleted)
  const deleted = result > 0;

  console.log(`Insight ${deleted ? "deleted" : "not found"}`);
  return deleted;
};
