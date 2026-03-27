import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import fs from "fs";
import cors from "cors";
import Database from "better-sqlite3";
import { fileURLToPath } from "url";
import { WebSocketServer, WebSocket } from "ws";
import { createServer } from "http";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

import multer from "multer";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database("restaurant.db");
const JWT_SECRET = process.env.JWT_SECRET || "saffron-spice-secret-key";

// Ensure uploads directory exists
const uploadPath = path.join(__dirname, "public", "uploads");
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Configure Multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ 
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// Email Transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const sendAdminNotification = async (reservation: any) => {
  if (!process.env.SMTP_USER || !process.env.ADMIN_EMAIL) return;

  try {
    await transporter.sendMail({
      from: `"Saffron Spice" <${process.env.SMTP_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: "New Table Reservation!",
      html: `
        <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #ea580c;">New Reservation Received</h2>
          <p><strong>Customer:</strong> ${reservation.name}</p>
          <p><strong>Email:</strong> ${reservation.email}</p>
          <p><strong>Phone:</strong> ${reservation.phone}</p>
          <p><strong>Date:</strong> ${reservation.date}</p>
          <p><strong>Time:</strong> ${reservation.time}</p>
          <p><strong>Guests:</strong> ${reservation.guests}</p>
          ${reservation.table_number ? `<p><strong>Table Number:</strong> ${reservation.table_number}</p>` : ''}
          ${reservation.note ? `<p><strong>Note:</strong> ${reservation.note}</p>` : ''}
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #666;">This is an automated notification from Saffron Spice Admin Panel.</p>
        </div>
      `,
    });
  } catch (err) {
    console.error("Failed to send email notification", err);
  }
};

// Initialize Database
const tableInfo = db.prepare("PRAGMA table_info(menu)").all() as any[];
const hasCategoryId = tableInfo.some(col => col.name === 'category_id');
if (tableInfo.length > 0 && !hasCategoryId) {
  db.exec("DROP TABLE IF EXISTS menu");
  db.exec("DROP TABLE IF EXISTS categories");
}

db.exec(`
  CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS menu (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    price REAL NOT NULL,
    category_id INTEGER,
    image_url TEXT,
    is_popular INTEGER DEFAULT 0,
    is_signature INTEGER DEFAULT 0,
    is_available INTEGER DEFAULT 1,
    variants TEXT,
    options TEXT,
    FOREIGN KEY (category_id) REFERENCES categories(id)
  );

  CREATE TABLE IF NOT EXISTS orders (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    customer_name TEXT,
    customer_email TEXT,
    address TEXT,
    items TEXT,
    total REAL,
    status TEXT DEFAULT 'pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reservations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    phone TEXT,
    date TEXT,
    time TEXT,
    guests INTEGER,
    note TEXT,
    table_number TEXT,
    status TEXT DEFAULT 'confirmed',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS reviews (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    rating INTEGER,
    comment TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS loyalty (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE,
    points INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS settings (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    restaurant_name TEXT,
    restaurant_type TEXT,
    tagline TEXT,
    primary_color TEXT,
    secondary_color TEXT,
    font_family TEXT,
    opening_hours TEXT,
    address TEXT,
    phone TEXT,
    email TEXT,
    seo_title TEXT,
    seo_description TEXT
  );

  CREATE TABLE IF NOT EXISTS staff (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT NOT NULL,
    image_url TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT,
    role TEXT DEFAULT 'user',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS newsletter (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS offers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT,
    code TEXT,
    expiry_date TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS gallery (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    image_url TEXT NOT NULL,
    caption TEXT,
    category TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed initial staff if empty
const staffCount = db.prepare("SELECT COUNT(*) as count FROM staff").get() as { count: number };
if (staffCount.count === 0) {
  const seedStaff = [
    { name: "Sanjay Kapoor", role: "Executive Chef", bio: "With 20+ years of experience in royal Indian cuisines.", image_url: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=400" },
    { name: "Priya Sharma", role: "Head of Pastry", bio: "Specializes in fusion Indian desserts and traditional sweets.", image_url: "https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?auto=format&fit=crop&q=80&w=400" },
    { name: "Vikram Singh", role: "Tandoor Specialist", bio: "The master behind our signature smoky tandoori flavors.", image_url: "https://images.unsplash.com/photo-1577214459173-9c8a5862c0cc?auto=format&fit=crop&q=80&w=400" },
    { name: "Meera Reddy", role: "Restaurant Manager", bio: "Ensuring every guest experiences true Indian hospitality.", image_url: "https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?auto=format&fit=crop&q=80&w=400" }
  ];
  const insert = db.prepare("INSERT INTO staff (name, role, bio, image_url) VALUES (?, ?, ?, ?)");
  seedStaff.forEach(s => insert.run(s.name, s.role, s.bio, s.image_url));
}

// Seed initial offers if empty
const offerCount = db.prepare("SELECT COUNT(*) as count FROM offers").get() as { count: number };
if (offerCount.count === 0) {
  const seedOffers = [
    { title: "Weekend Brunch Special", description: "Enjoy 20% off on our signature brunch menu every Saturday and Sunday.", code: "BRUNCH20", expiry_date: "2026-12-31" },
    { title: "First Order Discount", description: "Get ₹100 off on your first online order above ₹500.", code: "WELCOME100", expiry_date: "2026-06-30" },
    { title: "Family Feast Offer", description: "Free dessert platter with every family meal order of ₹1500 or more.", code: "FAMILYFUN", expiry_date: "2026-08-15" }
  ];
  const insertOffer = db.prepare("INSERT INTO offers (title, description, code, expiry_date) VALUES (?, ?, ?, ?)");
  seedOffers.forEach(o => insertOffer.run(o.title, o.description, o.code, o.expiry_date));
}

// Seed initial gallery if empty
const galleryCount = db.prepare("SELECT COUNT(*) as count FROM gallery").get() as { count: number };
if (galleryCount.count === 0) {
  const seedGallery = [
    { image_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=800", caption: "Our main dining hall with warm ambient lighting.", category: "Interior" },
    { image_url: "https://images.unsplash.com/photo-1552566626-52f8b828add9?auto=format&fit=crop&q=80&w=800", caption: "Signature Butter Chicken served with fresh Garlic Naan.", category: "Food" },
    { image_url: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&q=80&w=800", caption: "Private event setup for a corporate dinner.", category: "Events" },
    { image_url: "https://images.unsplash.com/photo-1583394293214-28ded15ee548?auto=format&fit=crop&q=80&w=800", caption: "Executive Chef Sanjay Kapoor in action.", category: "Staff" }
  ];
  const insertGallery = db.prepare("INSERT INTO gallery (image_url, caption, category) VALUES (?, ?, ?)");
  seedGallery.forEach(g => insertGallery.run(g.image_url, g.caption, g.category));
}

// Seed initial menu and categories if empty
const categoryCount = db.prepare("SELECT COUNT(*) as count FROM categories").get() as { count: number };
if (categoryCount.count === 0) {
  const categories = ["Starters", "Main Course", "Biryani", "Breads", "Desserts", "Drinks"];
  const insertCat = db.prepare("INSERT INTO categories (name, sort_order) VALUES (?, ?)");
  categories.forEach((name, idx) => insertCat.run(name, idx));
}

const menuCount = db.prepare("SELECT COUNT(*) as count FROM menu").get() as { count: number };
if (menuCount.count === 0) {
  const categories = db.prepare("SELECT * FROM categories").all() as any[];
  const getCatId = (name: string) => categories.find(c => c.name === name)?.id;

  const seedMenu = [
    // Starters
    { name: "Paneer Tikka", description: "Grilled cottage cheese marinated in aromatic spices and yogurt", price: 350, category: "Starters", image_url: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?auto=format&fit=crop&q=80&w=800", is_popular: 1 },
    { name: "Samosa Trio", description: "Crispy pastry filled with spiced potatoes and peas", price: 180, category: "Starters", image_url: "https://images.unsplash.com/photo-1589676762372-fd3e1f3acb8e?auto=format&fit=crop&q=80&w=800", is_popular: 1 },
    { name: "Veg Manchurian", description: "Deep-fried vegetable balls tossed in a spicy Indo-Chinese sauce", price: 240, category: "Starters", image_url: "https://images.unsplash.com/photo-1512058560366-cd2427ff56f3?auto=format&fit=crop&q=80&w=800", is_popular: 0 },
    { name: "Hara Bhara Kebab", description: "Healthy and delicious green kebabs made with spinach and peas", price: 260, category: "Starters", image_url: "https://images.unsplash.com/photo-1606491956689-2ea8c5119c85?auto=format&fit=crop&q=80&w=800", is_popular: 0 },
    
    // Main Course
    { name: "Butter Chicken", description: "Tender chicken in a rich, creamy tomato and butter sauce", price: 450, category: "Main Course", image_url: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?auto=format&fit=crop&q=80&w=800", is_popular: 1, is_signature: 1 },
    { name: "Paneer Butter Masala", description: "Cottage cheese cubes in a creamy and mildly spiced tomato gravy", price: 380, category: "Main Course", image_url: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800", is_popular: 0 },
    { name: "Dal Makhani", description: "Slow-cooked black lentils with cream and spices", price: 320, category: "Main Course", image_url: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?auto=format&fit=crop&q=80&w=800", is_popular: 1 },
    { name: "Chicken Curry", description: "Traditional home-style chicken curry with aromatic spices", price: 420, category: "Main Course", image_url: "https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?auto=format&fit=crop&q=80&w=800", is_popular: 0 },
    
    // Biryani
    { name: "Hyderabadi Biryani", description: "Fragrant basmati rice layered with spiced meat and saffron", price: 400, category: "Biryani", image_url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800", is_popular: 1, is_signature: 1 },
    { name: "Veg Biryani", description: "Aromatic basmati rice cooked with mixed vegetables and spices", price: 320, category: "Biryani", image_url: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?auto=format&fit=crop&q=80&w=800", is_popular: 0 },
    
    // Breads
    { name: "Garlic Naan", description: "Soft leavened bread topped with garlic and fresh cilantro", price: 80, category: "Breads", image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800", is_popular: 0 },
    { name: "Butter Naan", description: "Classic Indian flatbread brushed with melted butter", price: 70, category: "Breads", image_url: "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800", is_popular: 0 },
    { name: "Tandoori Roti", description: "Whole wheat bread baked in a traditional clay oven", price: 40, category: "Breads", image_url: "https://images.unsplash.com/photo-1516714435131-44d6b64dc6a2?auto=format&fit=crop&q=80&w=800", is_popular: 0 },
    
    // Desserts
    { name: "Gulab Jamun", description: "Soft milk-based dumplings soaked in cardamom sugar syrup", price: 150, category: "Desserts", image_url: "https://images.unsplash.com/photo-1589119908995-c6837fa14848?auto=format&fit=crop&q=80&w=800", is_popular: 0 },
    { name: "Rasmalai", description: "Soft cottage cheese discs in sweetened, thickened milk", price: 160, category: "Desserts", image_url: "https://images.unsplash.com/photo-1630953899906-d16511a72558?auto=format&fit=crop&q=80&w=800", is_popular: 0 },
    
    // Drinks
    { name: "Mango Lassi", description: "Creamy yogurt drink blended with sweet Alphonso mangoes", price: 120, category: "Drinks", image_url: "https://images.unsplash.com/photo-1596803244618-8dbee441d70b?auto=format&fit=crop&q=80&w=800", is_popular: 0 },
    { name: "Masala Chai", description: "Traditional Indian spiced tea brewed with milk and ginger", price: 60, category: "Drinks", image_url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&q=80&w=800", is_popular: 0 },
    { name: "Cold Coffee", description: "Refreshing chilled coffee blended with milk and ice cream", price: 140, category: "Drinks", image_url: "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=800", is_popular: 0 }
  ];

  const insert = db.prepare("INSERT INTO menu (name, description, price, category_id, image_url, is_popular, is_signature) VALUES (?, ?, ?, ?, ?, ?, ?)");
  seedMenu.forEach(item => insert.run(item.name, item.description, item.price, getCatId(item.category), item.image_url, item.is_popular, item.is_signature || 0));
}

// Fix existing broken images in the database
const brokenImages = {
  "Samosa Trio": "https://images.unsplash.com/photo-1589676762372-fd3e1f3acb8e?auto=format&fit=crop&q=80&w=800",
  "Hara Bhara Kebab": "https://images.unsplash.com/photo-1606491956689-2ea8c5119c85?auto=format&fit=crop&q=80&w=800",
  "Veg Manchurian": "https://images.unsplash.com/photo-1512058560366-cd2427ff56f3?auto=format&fit=crop&q=80&w=800",
  "Cold Coffee": "https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=800",
  "Mango Lassi": "https://images.unsplash.com/photo-1596803244618-8dbee441d70b?auto=format&fit=crop&q=80&w=800",
  "Paneer Butter Masala": "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?auto=format&fit=crop&q=80&w=800",
  "Garlic Naan": "https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&q=80&w=800"
};

const updateMenuImg = db.prepare("UPDATE menu SET image_url = ? WHERE name = ?");
Object.entries(brokenImages).forEach(([name, url]) => {
  updateMenuImg.run(url, name);
});

// Seed initial reviews if empty
const reviewCount = db.prepare("SELECT COUNT(*) as count FROM reviews").get() as { count: number };
if (reviewCount.count === 0) {
  const seedReviews = [
    { name: "Ananya Iyer", rating: 5, comment: "The Butter Chicken is divine! The best I've had outside of Delhi. The service is impeccable." },
    { name: "Rohan Mehra", rating: 5, comment: "Smart ordering system is so convenient. The AI recommendations were spot on!" },
    { name: "Sarah Jenkins", rating: 4, comment: "Beautiful ambiance and the spices are perfectly balanced. A true gem in the city." }
  ];
  const insert = db.prepare("INSERT INTO reviews (name, rating, comment) VALUES (?, ?, ?)");
  seedReviews.forEach(r => insert.run(r.name, r.rating, r.comment));
}

// Seed settings if empty
const settingsCount = db.prepare("SELECT COUNT(*) as count FROM settings").get() as { count: number };
if (settingsCount.count === 0) {
  db.prepare(`
    INSERT INTO settings (
      id, restaurant_name, restaurant_type, tagline, primary_color, 
      secondary_color, font_family, opening_hours, address, phone, 
      email, seo_title, seo_description
    ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    "Saffron Spice",
    "Premium Indian Restaurant",
    "A Symphony of Spices & Soul",
    "#ea580c",
    "#1c1917",
    "Inter",
    JSON.stringify({
      mon: "11:00 AM - 11:00 PM",
      tue: "11:00 AM - 11:00 PM",
      wed: "11:00 AM - 11:00 PM",
      thu: "11:00 AM - 11:00 PM",
      fri: "11:00 AM - 12:00 AM",
      sat: "11:00 AM - 12:00 AM",
      sun: "11:00 AM - 10:00 PM"
    }),
    "123 Saffron Lane, Culinary District, Mumbai, Maharashtra 400001",
    "+91 98765 43210",
    "hello@saffronspice.com",
    "Saffron Spice | Authentic Indian Cuisine",
    "Experience the true essence of Indian culinary traditions with a modern touch."
  );
}

async function startServer() {
  const app = express();
  const httpServer = createServer(app);
  const wss = new WebSocketServer({ server: httpServer });
  const PORT = 3000;

  // Track connected admin clients
  const clients = new Set<WebSocket>();
  wss.on("connection", (ws) => {
    clients.add(ws);
    ws.on("close", () => clients.delete(ws));
  });

  const broadcast = (data: any) => {
    const message = JSON.stringify(data);
    clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  };

  app.use(cors());
  app.use(express.json());
  app.use("/uploads", express.static(path.join(__dirname, "public", "uploads")));

  // Image Upload Route
  app.post("/api/upload", upload.single("image"), (req, res) => {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const imageUrl = `/uploads/${req.file.filename}`;
    res.json({ imageUrl });
  });

  // Auth Middleware
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.sendStatus(401);

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  };

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { email, password, name } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const role = email.toLowerCase() === 'adminsaffronspice@gmail.com' ? 'admin' : 'user';
      const result = db.prepare("INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)")
        .run(email, hashedPassword, name, role);
      res.json({ id: result.lastInsertRowid, email, name, role });
    } catch (e: any) {
      if (e.code === 'SQLITE_CONSTRAINT') {
        res.status(400).json({ error: "Email already exists" });
      } else {
        res.status(500).json({ error: "Registration failed" });
      }
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email) as any;

    if (!user) return res.status(400).json({ error: "User not found" });

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) return res.status(400).json({ error: "Invalid password" });

    const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET);
    res.json({ token, user: { id: user.id, email: user.email, name: user.name, role: user.role } });
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    const user = db.prepare("SELECT id, email, name, role FROM users WHERE id = ?").get(req.user.id);
    res.json(user);
  });

  // API Routes
  app.get("/api/search", (req, res) => {
    const query = req.query.q as string;
    if (!query) return res.json({ menu: [], orders: [], reservations: [] });

    const searchTerm = `%${query}%`;

    const menu = db.prepare(`
      SELECT m.*, c.name as category 
      FROM menu m 
      LEFT JOIN categories c ON m.category_id = c.id
      WHERE m.name LIKE ? OR m.description LIKE ? OR c.name LIKE ?
    `).all(searchTerm, searchTerm, searchTerm);
    const orders = db.prepare("SELECT * FROM orders WHERE customer_name LIKE ? OR customer_email LIKE ? OR address LIKE ?").all(searchTerm, searchTerm, searchTerm);
    const reservations = db.prepare("SELECT * FROM reservations WHERE name LIKE ? OR email LIKE ?").all(searchTerm, searchTerm);

    res.json({ menu, orders, reservations });
  });

  app.get("/api/menu", (req, res) => {
    const categories = db.prepare("SELECT * FROM categories ORDER BY sort_order").all();
    const items = db.prepare(`
      SELECT m.*, c.name as category 
      FROM menu m 
      LEFT JOIN categories c ON m.category_id = c.id
    `).all();
    res.json({ categories, items });
  });

  app.post("/api/menu/categories", (req, res) => {
    const { name, sort_order } = req.body;
    const result = db.prepare("INSERT INTO categories (name, sort_order) VALUES (?, ?)").run(name, sort_order);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/menu/categories/:id", (req, res) => {
    db.prepare("DELETE FROM categories WHERE id = ?").run(req.params.id);
    db.prepare("DELETE FROM menu WHERE category_id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/menu/items", (req, res) => {
    const { name, description, price, category_id, image_url, is_popular, is_signature, is_available, variants, options } = req.body;
    const result = db.prepare(`
      INSERT INTO menu (name, description, price, category_id, image_url, is_popular, is_signature, is_available, variants, options) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(name, description, price, category_id, image_url, is_popular ? 1 : 0, is_signature ? 1 : 0, is_available ? 1 : 0, variants, options);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/menu/items/:id", (req, res) => {
    const { name, description, price, category_id, image_url, is_popular, is_signature, is_available, variants, options } = req.body;
    db.prepare(`
      UPDATE menu SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?, is_popular = ?, is_signature = ?, is_available = ?, variants = ?, options = ?
      WHERE id = ?
    `).run(name, description, price, category_id, image_url, is_popular ? 1 : 0, is_signature ? 1 : 0, is_available ? 1 : 0, variants, options, req.params.id);
    res.json({ success: true });
  });

  app.patch("/api/menu/items/:id/availability", (req, res) => {
    const { is_available } = req.body;
    db.prepare("UPDATE menu SET is_available = ? WHERE id = ?").run(is_available ? 1 : 0, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/menu/items/:id", (req, res) => {
    db.prepare("DELETE FROM menu WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/orders", (req, res) => {
    const orders = db.prepare("SELECT * FROM orders ORDER BY created_at DESC").all();
    const formattedOrders = orders.map((order: any) => ({
      ...order,
      name: order.customer_name,
      email: order.customer_email,
      total_amount: order.total,
      items: JSON.parse(order.items || '[]'),
      // Add missing fields with defaults if necessary
      phone: order.phone || 'N/A',
      city: order.city || 'N/A',
      zip: order.zip || 'N/A',
      order_type: order.order_type || 'delivery',
      payment_method: order.payment_method || 'cod'
    }));
    res.json(formattedOrders);
  });

  app.get("/api/orders/:email", (req, res) => {
    const orders = db.prepare("SELECT * FROM orders WHERE customer_email = ? ORDER BY created_at DESC").all(req.params.email);
    const formattedOrders = orders.map((order: any) => ({
      ...order,
      items: JSON.parse(order.items || '[]')
    }));
    res.json(formattedOrders);
  });

  app.patch("/api/orders/:id/status", (req, res) => {
    const { status } = req.body;
    db.prepare("UPDATE orders SET status = ? WHERE id = ?").run(status, req.params.id);
    
    // Broadcast update
    broadcast({
      type: "ORDER_UPDATED",
      data: { id: parseInt(req.params.id), status }
    });
    
    res.json({ success: true });
  });

  app.patch("/api/orders/bulk/status", (req, res) => {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid IDs" });
    }
    const placeholders = ids.map(() => '?').join(',');
    db.prepare(`UPDATE orders SET status = ? WHERE id IN (${placeholders})`).run(status, ...ids);
    
    // Broadcast update
    broadcast({
      type: "BULK_ORDER_UPDATED",
      data: { ids, status }
    });
    
    res.json({ success: true });
  });

  app.post("/api/orders", (req, res) => {
    const { customer_name, customer_email, address, items, total } = req.body;
    const result = db.prepare("INSERT INTO orders (customer_name, customer_email, address, items, total) VALUES (?, ?, ?, ?, ?)")
      .run(customer_name, customer_email, address, JSON.stringify(items), total);
    
    const orderId = result.lastInsertRowid;

    // Broadcast new order
    broadcast({
      type: "NEW_ORDER",
      data: { 
        id: orderId, 
        name: customer_name, 
        email: customer_email, 
        address, 
        items, 
        total_amount: total,
        status: 'pending',
        created_at: new Date().toISOString(),
        phone: req.body.phone || 'N/A',
        city: req.body.city || 'N/A',
        zip: req.body.zip || 'N/A',
        order_type: req.body.order_type || 'delivery',
        payment_method: req.body.payment_method || 'cod'
      }
    });

    // Add loyalty points (1 point per 100 rupees)
    if (customer_email) {
      const points = Math.floor(total / 100);
      db.prepare("INSERT INTO loyalty (email, points) VALUES (?, ?) ON CONFLICT(email) DO UPDATE SET points = points + ?")
        .run(customer_email, points, points);
    }

    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/reservations", (req, res) => {
    const reservations = db.prepare("SELECT * FROM reservations ORDER BY date, time").all();
    res.json(reservations);
  });

  app.patch("/api/reservations/:id/status", (req, res) => {
    const { status, table_number } = req.body;
    if (table_number !== undefined) {
      db.prepare("UPDATE reservations SET status = ?, table_number = ? WHERE id = ?").run(status, table_number, req.params.id);
    } else {
      db.prepare("UPDATE reservations SET status = ? WHERE id = ?").run(status, req.params.id);
    }

    // Broadcast update
    broadcast({
      type: "RESERVATION_UPDATED",
      data: { id: parseInt(req.params.id), status, table_number }
    });

    res.json({ success: true });
  });

  app.patch("/api/reservations/bulk/status", (req, res) => {
    const { ids, status } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "Invalid IDs" });
    }
    const placeholders = ids.map(() => '?').join(',');
    db.prepare(`UPDATE reservations SET status = ? WHERE id IN (${placeholders})`).run(status, ...ids);
    
    // Broadcast update
    broadcast({
      type: "BULK_RESERVATION_UPDATED",
      data: { ids, status }
    });

    res.json({ success: true });
  });

  app.post("/api/reservations", (req, res) => {
    const { name, email, phone, date, time, guests, note, table_number } = req.body;
    const status = table_number ? 'seated' : 'confirmed';
    const result = db.prepare("INSERT INTO reservations (name, email, phone, date, time, guests, note, table_number, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)")
      .run(name, email, phone, date, time, guests, note, table_number, status);
    
    // Broadcast notification to admins
    broadcast({
      type: "NEW_RESERVATION",
      data: { id: result.lastInsertRowid, name, date, time, guests, phone, note, table_number, status }
    });

    // Send email notification
    sendAdminNotification({ name, email, phone, date, time, guests, note, table_number, status });

    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/reviews", (req, res) => {
    const reviews = db.prepare("SELECT * FROM reviews ORDER BY created_at DESC").all();
    res.json(reviews);
  });

  app.delete("/api/reviews/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    db.prepare("DELETE FROM reviews WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/users", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const users = db.prepare("SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC").all();
    res.json(users);
  });

  app.delete("/api/users/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    // Don't allow deleting the current user or the default admin
    if (parseInt(req.params.id) === req.user.id) return res.status(400).json({ error: "Cannot delete yourself" });
    db.prepare("DELETE FROM users WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.post("/api/reviews", (req, res) => {
    const { name, rating, comment } = req.body;
    const result = db.prepare("INSERT INTO reviews (name, rating, comment) VALUES (?, ?, ?)")
      .run(name, rating, comment);
    res.json({ id: result.lastInsertRowid });
  });

  app.get("/api/loyalty", (req, res) => {
    const data = db.prepare("SELECT * FROM loyalty ORDER BY points DESC").all();
    res.json(data);
  });

  app.get("/api/loyalty/:email", (req, res) => {
    const data = db.prepare("SELECT * FROM loyalty WHERE email = ?").get(req.params.email);
    res.json(data || { points: 0 });
  });

  app.post("/api/loyalty/join", (req, res) => {
    const { email } = req.body;
    try {
      db.prepare("INSERT INTO loyalty (email) VALUES (?)").run(email);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "Already joined" });
    }
  });

  app.post("/api/newsletter", (req, res) => {
    const { email } = req.body;
    try {
      db.prepare("INSERT INTO newsletter (email) VALUES (?)").run(email);
      res.json({ success: true });
    } catch (e) {
      // If already subscribed, still return success to the user
      res.json({ success: true, already_subscribed: true });
    }
  });

  app.get("/api/staff", (req, res) => {
    const staff = db.prepare("SELECT * FROM staff ORDER BY id").all();
    res.json(staff);
  });

  app.post("/api/staff", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { name, role, bio, image_url } = req.body;
    const result = db.prepare("INSERT INTO staff (name, role, bio, image_url) VALUES (?, ?, ?, ?)").run(name, role, bio, image_url);
    res.json({ id: result.lastInsertRowid });
  });

  app.put("/api/staff/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { name, role, bio, image_url } = req.body;
    db.prepare("UPDATE staff SET name = ?, role = ?, bio = ?, image_url = ? WHERE id = ?").run(name, role, bio, image_url, req.params.id);
    res.json({ success: true });
  });

  app.delete("/api/staff/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    db.prepare("DELETE FROM staff WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/analytics", (req, res) => {
    const totalOrders = db.prepare("SELECT COUNT(*) as count FROM orders").get() as { count: number };
    const totalRevenue = db.prepare("SELECT SUM(total) as total FROM orders").get() as { total: number };
    const totalReservations = db.prepare("SELECT COUNT(*) as count FROM reservations").get() as { count: number };
    const avgRating = db.prepare("SELECT AVG(rating) as avg FROM reviews").get() as { avg: number };
    const totalGuests = db.prepare("SELECT SUM(guests) as total FROM reservations").get() as { total: number };

    // Revenue by day for the last 7 days
    const revenueByDay = db.prepare(`
      SELECT strftime('%w', created_at) as day, SUM(total) as total 
      FROM orders 
      WHERE created_at >= date('now', '-7 days')
      GROUP BY day
    `).all() as any[];

    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const revenueData = dayNames.map((name, idx) => {
      const dayData = revenueByDay.find(d => parseInt(d.day) === idx);
      return { name, value: dayData ? dayData.total : 0 };
    });

    // Top dishes
    const topDishes = db.prepare(`
      SELECT name, price, is_popular 
      FROM menu 
      WHERE is_popular = 1 
      LIMIT 4
    `).all();

    res.json({
      totalOrders: totalOrders.count,
      totalRevenue: totalRevenue.total || 0,
      totalReservations: totalReservations.count,
      avgRating: avgRating.avg ? parseFloat(avgRating.avg.toFixed(1)) : 0,
      totalGuests: totalGuests.total || 0,
      revenueData,
      topDishes
    });
  });

  // AI Recommendation Logic (Simple heuristic)
  app.get("/api/recommendations", (req, res) => {
    // Logic: Signature dishes + Randomly pick 2 others
    const signatures = db.prepare("SELECT * FROM menu WHERE is_signature = 1").all();
    const others = db.prepare("SELECT * FROM menu WHERE is_signature = 0 ORDER BY RANDOM() LIMIT 2").all();
    res.json([...signatures, ...others]);
  });

  app.get("/api/settings", (req, res) => {
    const settings = db.prepare("SELECT * FROM settings WHERE id = 1").get();
    res.json(settings);
  });

  app.post("/api/settings", (req, res) => {
    const fields = Object.keys(req.body).filter(k => k !== 'id');
    const values = fields.map(k => typeof req.body[k] === 'object' ? JSON.stringify(req.body[k]) : req.body[k]);
    
    const setClause = fields.map(f => `${f} = ?`).join(', ');
    db.prepare(`UPDATE settings SET ${setClause} WHERE id = 1`).run(...values);
    res.json({ success: true });
  });

  // Newsletter
  app.get("/api/newsletter", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const subs = db.prepare("SELECT * FROM newsletter ORDER BY created_at DESC").all();
    res.json(subs);
  });

  app.post("/api/newsletter", (req, res) => {
    const { email } = req.body;
    try {
      db.prepare("INSERT INTO newsletter (email) VALUES (?)").run(email);
      res.json({ success: true });
    } catch (e) {
      res.status(400).json({ error: "Already subscribed" });
    }
  });

  // Offers
  app.get("/api/offers", (req, res) => {
    const offers = db.prepare("SELECT * FROM offers ORDER BY created_at DESC").all();
    res.json(offers);
  });

  app.post("/api/offers", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { title, description, code, expiry_date } = req.body;
    const result = db.prepare("INSERT INTO offers (title, description, code, expiry_date) VALUES (?, ?, ?, ?)")
      .run(title, description, code, expiry_date);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/offers/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    db.prepare("DELETE FROM offers WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Gallery
  app.get("/api/gallery", (req, res) => {
    const items = db.prepare("SELECT * FROM gallery ORDER BY created_at DESC").all();
    res.json(items);
  });

  app.post("/api/gallery", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const { image_url, caption, category } = req.body;
    const result = db.prepare("INSERT INTO gallery (image_url, caption, category) VALUES (?, ?, ?)")
      .run(image_url, caption, category);
    res.json({ id: result.lastInsertRowid });
  });

  app.delete("/api/gallery/:id", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    db.prepare("DELETE FROM gallery WHERE id = ?").run(req.params.id);
    res.json({ success: true });
  });

  // Global Admin Search
  app.get("/api/search", authenticateToken, (req: any, res) => {
    if (req.user.role !== 'admin') return res.sendStatus(403);
    const query = `%${req.query.q}%`;
    
    const results = [
      ...db.prepare("SELECT 'order' as type, id, customer_name as title, status as subtitle FROM orders WHERE customer_name LIKE ? OR id LIKE ? LIMIT 5").all(query, query),
      ...db.prepare("SELECT 'reservation' as type, id, name as title, date || ' ' || time as subtitle FROM reservations WHERE name LIKE ? LIMIT 5").all(query),
      ...db.prepare("SELECT 'menu' as type, id, name as title, price as subtitle FROM menu WHERE name LIKE ? LIMIT 5").all(query),
      ...db.prepare("SELECT 'user' as type, id, name as title, email as subtitle FROM users WHERE name LIKE ? OR email LIKE ? LIMIT 5").all(query, query),
      ...db.prepare("SELECT 'staff' as type, id, name as title, role as subtitle FROM staff WHERE name LIKE ? LIMIT 5").all(query)
    ];
    
    res.json(results);
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  httpServer.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
