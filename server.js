const express = require("express");
const cors = require("cors");
const path = require("path");
const session = require("express-session");
const db = require("./db");

const app = express();
const PORT = 3000;

// Configurações básicas
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configuração de sessão para login admin
app.use(session({
    secret: "rdes-admin-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 // 1 hora
    }
}));

// Serve TODOS os arquivos do projeto sem mudar os caminhos originais
app.use(express.static(__dirname));

// Login fixo do admin
const ADMIN_EMAIL = "admin@rdes.local";
const ADMIN_PASSWORD = "123456";

// Middleware para proteger rotas admin
function requireAdminLogin(req, res, next) {
    if (!req.session.adminLoggedIn) {
        return res.status(401).json({
            success: false,
            message: "Acesso negado. Faça login primeiro."
        });
    }

    next();
}

// Quando acessar localhost:3000, abrir a home original
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "App", "src", "view", "index.html"));
});

// =============================
// ROTAS DO FORMULÁRIO CUSTOMER
// =============================

// Rota para salvar cadastro do Become a Customer
app.post("/api/customers", (req, res) => {
    const { name, email, description } = req.body;

    if (!name || !email || !description) {
        return res.status(400).json({
            success: false,
            message: "Preencha todos os campos."
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "E-mail inválido."
        });
    }

    const query = `
        INSERT INTO customers (name, email, description)
        VALUES (?, ?, ?)
    `;

    db.run(query, [name, email, description], function (err) {
        if (err) {
            console.error("Erro ao salvar:", err.message);

            return res.status(500).json({
                success: false,
                message: "Erro ao salvar no banco de dados."
            });
        }

        res.status(201).json({
            success: true,
            message: "Cadastro enviado com sucesso!",
            id: this.lastID
        });
    });
});

// Rota pública para listar os cadastros salvos
app.get("/api/customers", (req, res) => {
    db.all("SELECT * FROM customers ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar:", err.message);

            return res.status(500).json({
                success: false,
                message: "Erro ao buscar cadastros."
            });
        }

        res.json(rows);
    });
});

// =============================
// ROTAS DO ADMIN
// =============================

// Login do admin
app.post("/api/admin/login", (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Preencha e-mail e senha."
        });
    }

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        req.session.adminLoggedIn = true;
        req.session.adminEmail = email;

        return res.json({
            success: true,
            message: "Login realizado com sucesso!"
        });
    }

    return res.status(401).json({
        success: false,
        message: "E-mail ou senha inválidos."
    });
});

// Verificar se o admin está logado
app.get("/api/admin/check", (req, res) => {
    if (req.session.adminLoggedIn) {
        return res.json({
            loggedIn: true,
            email: req.session.adminEmail
        });
    }

    return res.status(401).json({
        loggedIn: false,
        message: "Admin não está logado."
    });
});

// Logout do admin
app.post("/api/admin/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({
                success: false,
                message: "Erro ao sair."
            });
        }

        res.json({
            success: true,
            message: "Logout realizado com sucesso."
        });
    });
});

// Rota protegida para o admin visualizar os customers
app.get("/api/admin/customers", requireAdminLogin, (req, res) => {
    db.all("SELECT * FROM customers ORDER BY created_at DESC", [], (err, rows) => {
        if (err) {
            console.error("Erro ao buscar customers no admin:", err.message);

            return res.status(500).json({
                success: false,
                message: "Erro ao buscar cadastros."
            });
        }

        res.json({
            success: true,
            customers: rows
        });
    });
});

// Abrir tela de login admin
app.get("/admin", (req, res) => {
    res.sendFile(path.join(__dirname, "App", "src", "view", "admin", "login.html"));
});

app.get("/admin/", (req, res) => {
    res.sendFile(path.join(__dirname, "App", "src", "view", "admin", "login.html"));
});

// Abrir dashboard admin
app.get("/admin/dashboard", (req, res) => {
    res.sendFile(path.join(__dirname, "App", "src", "view", "admin", "dashboard.html"));
});

// Inicializar servidor
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
    console.log(`Home: http://localhost:${PORT}`);
    console.log(`Admin: http://localhost:${PORT}/admin`);
});