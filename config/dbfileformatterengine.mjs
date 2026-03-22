import fs from "fs";
import path from "path";

/* ─────────────────────────────────────────────
   🧠 UTIL: SAFE SQL SPLITTER
───────────────────────────────────────────── */
function splitSQL(raw) {
  return raw
    .replace(/\r/g, "")
    .split(/;\n|;\r\n/)
    .map(s => s.trim())
    .filter(Boolean)
    .map(s => s + ";");
}

/* ─────────────────────────────────────────────
   🧠 DETECT DB TYPE
───────────────────────────────────────────── */
export function detectDatabase(sql) {
  const s = sql.toLowerCase();

  if (s.includes("auto_increment")) return "mysql";
  if (s.includes("engine=")) return "mysql-xampp";
  if (s.includes("serial")) return "postgres";
  if (s.includes("createcollection") || s.includes("db.")) return "mongo";
  return "unknown";
}

/* ─────────────────────────────────────────────
   🧠 CLASSIFY SQL
───────────────────────────────────────────── */
function classify(sql) {
  if (/^\s*create/i.test(sql)) return "create";
  if (/^\s*insert/i.test(sql)) return "insert";
  if (/^\s*drop/i.test(sql)) return "drop";
  if (/^\s*alter/i.test(sql)) return "alter";
  if (/^\s*truncate/i.test(sql)) return "alter";
  return "other";
}

/* ─────────────────────────────────────────────
   🧠 EXTRACTORS
───────────────────────────────────────────── */
function extract(statements, type) {
  return statements.filter(s => classify(s) === type);
}

/* ─────────────────────────────────────────────
   🧠 MYSQL/XAMPP NORMALIZER
───────────────────────────────────────────── */
export function xamppNormalize(sql) {
  return sql
    .replace(/ENGINE=InnoDB/gi, "")
    .replace(/DEFAULT CHARSET=\w+/gi, "")
    .replace(/AUTO_INCREMENT=\d+/gi, "")
    .replace(/`/g, "");
}

/* ─────────────────────────────────────────────
   🧠 INSERT → JSON
───────────────────────────────────────────── */
function insertsToJSON(inserts) {
  return inserts.map(sql => {
    const table = sql.match(/INSERT INTO\s+(\w+)/i)?.[1] || "unknown";

    return {
      table,
      raw: sql
    };
  });
}

/* ─────────────────────────────────────────────
   🧠 INSERT → CSV (SIMPLE FLATTEN)
───────────────────────────────────────────── */
function insertsToCSV(inserts) {
  return inserts.map(i => `"${i.replace(/"/g, '""')}"`).join("\n");
}

/* ─────────────────────────────────────────────
   🧠 SQL → MONGO
───────────────────────────────────────────── */
export function sqlToMongo(inserts) {
  return inserts.map(sql => {
    const table = sql.match(/INSERT INTO\s+(\w+)/i)?.[1];

    const values = sql
      .match(/\(([^)]+)\)/g)
      ?.map(v => v.replace(/[()]/g, "").split(",")) || [];

    return {
      collection: table,
      documents: values
    };
  });
}

/* ─────────────────────────────────────────────
   🧠 MONGO → SQL
───────────────────────────────────────────── */
export function mongoToSQL(collection, docs) {
  return docs.map(doc => {
    const keys = Object.keys(doc).join(", ");
    const values = Object.values(doc)
      .map(v => `'${v}'`)
      .join(", ");

    return `INSERT INTO ${collection} (${keys}) VALUES (${values});`;
  });
}

/* ─────────────────────────────────────────────
   🧠 MAIN ENGINE (ALL IN ONE)
───────────────────────────────────────────── */
export function mergeSeparateSQL(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");

  const base = path.basename(filePath, path.extname(filePath));
  const dbType = detectDatabase(raw);

  let cleaned = raw;

  // normalize if xampp/mysql
  if (dbType.includes("mysql")) {
    cleaned = xamppNormalize(raw);
  }

  const statements = splitSQL(cleaned);

  const creates = extract(statements, "create");
  const inserts = extract(statements, "insert");

  /* ───────── OUTPUT SQL ───────── */
  const crudSQL =
`-- CRUD STRUCTURE (${dbType})
SET FOREIGN_KEY_CHECKS=0;

${creates.join("\n\n")}

SET FOREIGN_KEY_CHECKS=1;
`;

  const insertSQL =
`-- INSERT DATA (${dbType})
SET FOREIGN_KEY_CHECKS=0;

${inserts.join("\n\n")}

SET FOREIGN_KEY_CHECKS=1;
`;

  /* ───────── OUTPUT JSON ───────── */
  const crudJSON = {
    dbType,
    tables: creates.length,
    inserts: inserts.length,
    schema: creates
  };

  const insertJSON = insertsToJSON(inserts);

  /* ───────── OUTPUT CSV ───────── */
  const insertCSV = insertsToCSV(inserts);

  /* ───────── WRITE FILES ───────── */
  fs.writeFileSync(`${base}-crud.sql`, crudSQL);
  fs.writeFileSync(`${base}-insert.sql`, insertSQL);
  fs.writeFileSync(`${base}-crud.json`, JSON.stringify(crudJSON, null, 2));
  fs.writeFileSync(`${base}-insert.json`, JSON.stringify(insertJSON, null, 2));
  fs.writeFileSync(`${base}-insert.csv`, insertCSV);

  return {
    dbType,
    files: {
      crudSQL: `${base}-crud.sql`,
      insertSQL: `${base}-insert.sql`,
      crudJSON: `${base}-crud.json`,
      insertJSON: `${base}-insert.json`,
      insertCSV: `${base}-insert.csv`
    }
  };
}