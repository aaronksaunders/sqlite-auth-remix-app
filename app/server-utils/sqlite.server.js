import Database from "better-sqlite3";
export const db = new Database("my-app.db", {
  verbose: (p) => console.log(...p),
});
db.pragma("journal_mode = WAL");
