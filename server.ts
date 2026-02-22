import express from "express";
import cors from "cors";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("unigest_v2.db");

// Test database connection and writeability
try {
  db.prepare("CREATE TABLE IF NOT EXISTS _connection_test (id INTEGER PRIMARY KEY)").run();
  db.prepare("INSERT INTO _connection_test DEFAULT VALUES").run();
  db.prepare("DROP TABLE _connection_test").run();
  console.log("Database connection and write test successful");
} catch (err) {
  console.error("Database connection or write test failed:", err);
}

// Initialize Database Tables
db.exec(`
  CREATE TABLE IF NOT EXISTS associations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    internal_number TEXT UNIQUE,
    name TEXT NOT NULL,
    school TEXT NOT NULL,
    province TEXT NOT NULL,
    municipality TEXT NOT NULL,
    neighborhood TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Migration: Add internal_number if it doesn't exist (for existing databases)
try {
  db.prepare("SELECT internal_number FROM associations LIMIT 1").get();
} catch (e) {
  try {
    db.exec("ALTER TABLE associations ADD COLUMN internal_number TEXT UNIQUE");
    console.log("Added internal_number column to associations table");
  } catch (err) {
    console.error("Migration failed:", err);
  }
}

db.exec(`
  CREATE TABLE IF NOT EXISTS members (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    association_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    course TEXT,
    FOREIGN KEY (association_id) REFERENCES associations (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    association_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    coordinator_id INTEGER,
    deputy_id INTEGER,
    secretary_id INTEGER,
    other_members TEXT,
    FOREIGN KEY (association_id) REFERENCES associations (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS leadership (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    association_id INTEGER NOT NULL,
    role TEXT NOT NULL,
    name TEXT NOT NULL,
    grade TEXT NOT NULL,
    course TEXT,
    photo TEXT,
    FOREIGN KEY (association_id) REFERENCES associations (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    association_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    photo TEXT,
    date TEXT NOT NULL,
    time TEXT NOT NULL,
    location TEXT NOT NULL,
    FOREIGN KEY (association_id) REFERENCES associations (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    association_id INTEGER NOT NULL,
    description TEXT NOT NULL,
    photo TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (association_id) REFERENCES associations (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    association_id INTEGER NOT NULL,
    statute TEXT,
    terms TEXT,
    contract TEXT,
    school_logo TEXT,
    association_logo TEXT,
    FOREIGN KEY (association_id) REFERENCES associations (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    association_id INTEGER NOT NULL,
    student_name TEXT NOT NULL,
    student_grade TEXT NOT NULL,
    description TEXT NOT NULL,
    satisfied INTEGER NOT NULL, -- 0 or 1
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (association_id) REFERENCES associations (id) ON DELETE CASCADE
  );
`);

// Migration: Add visits column if it doesn't exist
try {
  db.prepare("SELECT visits FROM associations LIMIT 1").get();
} catch (e) {
  try {
    db.exec("ALTER TABLE associations ADD COLUMN visits INTEGER DEFAULT 0");
    console.log("Added visits column to associations table");
  } catch (err) {
    console.error("Migration failed (visits):", err);
  }
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json({ limit: '50mb' }));

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", database: "connected" });
  });
  
  // Get all associations (for dashboard count)
  app.get("/api/associations", (req, res) => {
    const rows = db.prepare("SELECT id, name, school, province, municipality, neighborhood FROM associations").all();
    res.json(rows);
  });

  // Create Association
  app.post("/api/associations", (req, res) => {
    console.log("POST /api/associations received:", req.body);
    const { name, school, province, municipality, neighborhood } = req.body;
    
    if (!name || !school || !province || !municipality || !neighborhood) {
      console.log("Missing required fields");
      return res.status(400).json({ error: "Todos os campos são obrigatórios" });
    }
    
    // Generate random password (8 chars)
    const password = Math.random().toString(36).slice(-8).toUpperCase();
    
    // Generate internal number (AE-YYYY-RAND)
    const year = new Date().getFullYear();
    const rand = Math.floor(1000 + Math.random() * 9000);
    const internal_number = `AE-${year}-${rand}`;

    try {
      const info = db.prepare(`
        INSERT INTO associations (internal_number, name, school, province, municipality, neighborhood, password)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `).run(internal_number, name, school, province, municipality, neighborhood, password);
      
      const associationId = info.lastInsertRowid;
      console.log("Association created with ID:", associationId);
      
      // Initialize documents for this association
      db.prepare("INSERT INTO documents (association_id) VALUES (?)").run(associationId);
      
      res.json({ 
        id: associationId, 
        internal_number, 
        password, 
        success: true 
      });
    } catch (error: any) {
      console.error("Database error:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // Login to Association
  app.post("/api/associations/login", (req, res) => {
    const { internal_number, password } = req.body;
    const association = db.prepare("SELECT * FROM associations WHERE internal_number = ? AND password = ?").get(internal_number, password);
    if (association) {
      res.json({ association, success: true });
    } else {
      res.status(401).json({ error: "Credenciais inválidas" });
    }
  });

  // Update Association
  app.put("/api/associations/:id", (req, res) => {
    const { id } = req.params;
    const { name, school, province, municipality, neighborhood } = req.body;
    db.prepare(`
      UPDATE associations 
      SET name = ?, school = ?, province = ?, municipality = ?, neighborhood = ?
      WHERE id = ?
    `).run(name, school, province, municipality, neighborhood, id);
    res.json({ success: true });
  });

  // Delete Association
  app.delete("/api/associations/:id", (req, res) => {
    const { id } = req.params;
    db.prepare("DELETE FROM associations WHERE id = ?").run(id);
    res.json({ success: true });
  });

  // Members
  app.get("/api/associations/:id/members", (req, res) => {
    const rows = db.prepare("SELECT * FROM members WHERE association_id = ?").all(req.params.id);
    res.json(rows);
  });

  app.post("/api/associations/:id/members", (req, res) => {
    const { name, grade, course } = req.body;
    db.prepare("INSERT INTO members (association_id, name, grade, course) VALUES (?, ?, ?, ?)")
      .run(req.params.id, name, grade, course);
    res.json({ success: true });
  });

  app.put("/api/members/:id", (req, res) => {
    const { name, grade, course } = req.body;
    db.prepare("UPDATE members SET name = ?, grade = ?, course = ? WHERE id = ?")
      .run(name, grade, course, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/members/:id", (req, res) => {
    db.prepare("DELETE FROM members WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Departments
  app.get("/api/associations/:id/departments", (req, res) => {
    const rows = db.prepare("SELECT * FROM departments WHERE association_id = ?").all(req.params.id);
    res.json(rows);
  });

  app.post("/api/associations/:id/departments", (req, res) => {
    const { name, coordinator_id, deputy_id, secretary_id, other_members } = req.body;
    db.prepare(`
      INSERT INTO departments (association_id, name, coordinator_id, deputy_id, secretary_id, other_members)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.params.id, name, coordinator_id, deputy_id, secretary_id, other_members);
    res.json({ success: true });
  });

  app.put("/api/departments/:id", (req, res) => {
    const { name, coordinator_id, deputy_id, secretary_id, other_members } = req.body;
    db.prepare(`
      UPDATE departments 
      SET name = ?, coordinator_id = ?, deputy_id = ?, secretary_id = ?, other_members = ?
      WHERE id = ?
    `).run(name, coordinator_id, deputy_id, secretary_id, other_members, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/departments/:id", (req, res) => {
    db.prepare("DELETE FROM departments WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Leadership
  app.get("/api/associations/:id/leadership", (req, res) => {
    const rows = db.prepare("SELECT * FROM leadership WHERE association_id = ?").all(req.params.id);
    res.json(rows);
  });

  app.post("/api/associations/:id/leadership", (req, res) => {
    const { role, name, grade, course, photo } = req.body;
    db.prepare(`
      INSERT INTO leadership (association_id, role, name, grade, course, photo)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.params.id, role, name, grade, course, photo);
    res.json({ success: true });
  });

  app.put("/api/leadership/:id", (req, res) => {
    const { role, name, grade, course, photo } = req.body;
    db.prepare(`
      UPDATE leadership 
      SET role = ?, name = ?, grade = ?, course = ?, photo = ?
      WHERE id = ?
    `).run(role, name, grade, course, photo, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/leadership/:id", (req, res) => {
    db.prepare("DELETE FROM leadership WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Events
  app.get("/api/associations/:id/events", (req, res) => {
    const rows = db.prepare("SELECT * FROM events WHERE association_id = ?").all(req.params.id);
    res.json(rows);
  });

  app.post("/api/associations/:id/events", (req, res) => {
    const { description, photo, date, time, location } = req.body;
    db.prepare(`
      INSERT INTO events (association_id, description, photo, date, time, location)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.params.id, description, photo, date, time, location);
    res.json({ success: true });
  });

  app.put("/api/events/:id", (req, res) => {
    const { description, photo, date, time, location } = req.body;
    db.prepare(`
      UPDATE events 
      SET description = ?, photo = ?, date = ?, time = ?, location = ?
      WHERE id = ?
    `).run(description, photo, date, time, location, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/events/:id", (req, res) => {
    db.prepare("DELETE FROM events WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Gallery
  app.get("/api/associations/:id/gallery", (req, res) => {
    const rows = db.prepare("SELECT * FROM gallery WHERE association_id = ? ORDER BY created_at DESC").all(req.params.id);
    res.json(rows);
  });

  app.post("/api/associations/:id/gallery", (req, res) => {
    const { description, photo } = req.body;
    db.prepare("INSERT INTO gallery (association_id, description, photo) VALUES (?, ?, ?)")
      .run(req.params.id, description, photo);
    res.json({ success: true });
  });

  // Complaints
  app.get("/api/associations/:id/complaints", (req, res) => {
    const rows = db.prepare("SELECT * FROM complaints WHERE association_id = ? ORDER BY created_at DESC").all(req.params.id);
    res.json(rows);
  });

  app.post("/api/associations/:id/complaints", (req, res) => {
    const { student_name, student_grade, description, satisfied } = req.body;
    db.prepare(`
      INSERT INTO complaints (association_id, student_name, student_grade, description, satisfied)
      VALUES (?, ?, ?, ?, ?)
    `).run(req.params.id, student_name, student_grade, description, satisfied ? 1 : 0);
    res.json({ success: true });
  });

  // Visits
  app.post("/api/associations/:id/visit", (req, res) => {
    db.prepare("UPDATE associations SET visits = visits + 1 WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Documents & Settings
  app.get("/api/associations/:id/settings", (req, res) => {
    const association = db.prepare("SELECT name, school, province, municipality, neighborhood, visits FROM associations WHERE id = ?").get(req.params.id);
    const docs = db.prepare("SELECT * FROM documents WHERE association_id = ?").get(req.params.id);
    res.json({ association, docs });
  });

  app.put("/api/associations/:id/settings/docs", (req, res) => {
    const { statute, terms, contract, school_logo, association_logo } = req.body;
    db.prepare(`
      UPDATE documents 
      SET statute = COALESCE(?, statute), 
          terms = COALESCE(?, terms), 
          contract = COALESCE(?, contract), 
          school_logo = COALESCE(?, school_logo), 
          association_logo = COALESCE(?, association_logo)
      WHERE association_id = ?
    `).run(statute, terms, contract, school_logo, association_logo, req.params.id);
    res.json({ success: true });
  });

  app.put("/api/associations/:id/settings/password", (req, res) => {
    const { password } = req.body;
    db.prepare("UPDATE associations SET password = ? WHERE id = ?").run(password, req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
