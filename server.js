const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const db = require("./db");

const app = express();
const PORT = 3000;

// Basic settings
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Admin session configuration
app.use(session({
    secret: "rdes-admin-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hour
    }
}));

// Serve all project files without changing your original routes
app.use(express.static(__dirname));

// Admin accounts
const ADMINS = [
    {
        email: "tiago@rdes.local",
        password: "123456"
    },
    {
        email: "joao@rdes.local",
        password: "123456"
    },
    {
        email: "laryssa@rdes.local",
        password: "123456"
    }
];

// Middleware to protect admin routes
function requireAdminLogin(req, res, next) {
    if (!req.session.adminLoggedIn) {
        return res.status(401).json({
            success: false,
            message: "Access denied. Please log in first."
        });
    }

    next();
}

// Home page
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "App", "src", "view", "index.html"));
});

// =============================
// CUSTOMER FORM ROUTES
// =============================

// Save Become a Customer form data
app.post("/api/customers", (req, res) => {
    const { name, email, description } = req.body;

    if (!name || !email || !description) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all fields."
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email address."
        });
    }

    const query = `
        INSERT INTO customers (name, email, description)
        VALUES (?, ?, ?)
    `;

    db.run(query, [name, email, description], function (err) {
        if (err) {
            console.error("Error saving customer:", err.message);

            return res.status(500).json({
                success: false,
                message: "Error saving data to the database."
            });
        }

        res.status(201).json({
            success: true,
            message: "Customer registered successfully!",
            id: this.lastID
        });
    });
});

// Public route to list customers
app.get("/api/customers", (req, res) => {
    db.all("SELECT * FROM customers ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            console.error("Error fetching customers:", err.message);

            return res.status(500).json({
                success: false,
                message: "Error fetching customers."
            });
        }

        res.json(rows);
    });
});

// =============================
// ADMIN ROUTES
// =============================

// Admin login
app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Please enter email and password."
        });
    }

    const adminFound = ADMINS.find(admin => {
        return admin.email === email && admin.password === password;
    });

    if (adminFound) {
        req.session.adminLoggedIn = true;
        req.session.adminEmail = adminFound.email;

        return res.json({
            success: true,
            message: "Login successful!"
        });
    }

    return res.status(401).json({
        success: false,
        message: "Invalid email or password."
    });
});

// Check admin session
app.get("/api/admin/check", (req, res) => {
    if (req.session.adminLoggedIn) {
        return res.json({
            loggedIn: true,
            email: req.session.adminEmail
        });
    }

    return res.status(401).json({
        loggedIn: false,
        message: "Admin is not logged in."
    });
});

// Admin logout
app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Error logging out."
            });
        }

        res.json({
            success: true,
            message: "Logout successful."
        });
    });
});

// List customers in admin dashboard
app.get("/api/admin/customers", requireAdminLogin, (req, res) => {
    db.all("SELECT * FROM customers ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            console.error("Error fetching admin customers:", err.message);

            return res.status(500).json({
                success: false,
                message: "Error fetching customers."
            });
        }

        res.json({
            success: true,
            customers: rows
        });
    });
});

// Update customer in admin dashboard
app.put("/api/admin/customers/:id", requireAdminLogin, (req, res) => {
    const { id } = req.params;
    const { name, email, description } = req.body;

    if (!name || !email || !description) {
        return res.status(400).json({
            success: false,
            message: "Please fill in all fields."
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "Invalid email address."
        });
    }

    const query = `
        UPDATE customers
        SET name = ?, email = ?, description = ?
        WHERE id = ?
    `;

    db.run(query, [name, email, description, id], function (err) {
        if (err) {
            console.error("Error updating customer:", err.message);

            return res.status(500).json({
                success: false,
                message: "Error updating customer."
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });
        }

        res.json({
            success: true,
            message: "Customer updated successfully!"
        });
    });
});

// Delete customer in admin dashboard
app.delete("/api/admin/customers/:id", requireAdminLogin, (req, res) => {
    const { id } = req.params;

    db.run("DELETE FROM customers WHERE id = ?", [id], function (err) {
        if (err) {
            console.error("Error deleting customer:", err.message);

            return res.status(500).json({
                success: false,
                message: "Error deleting customer." 
        });
        }

        if (this.changes === 0) {
            return res.status(404).json({
                success: false,
                message: "Customer not found."
            });
        }

        res.json({
            success: true,
            message: "Customer deleted successfully!"
        });
    });
});

// Admin login page
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "App", "src", "view", "admin", "login.html"));
});

app.get("/admin/", (req, res) => {
    res.sendFile(path.join(__dirname, "App", "src", "view", "admin", "login.html"));
});

// Admin dashboard page
app.get("/admin/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "App", "src", "view", "admin", "dashboard.html"));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`Home: http://localhost:${PORT}`);
    console.log(`Admin: http://localhost:${PORT}/admin`);
});
