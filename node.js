const express = require('express');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

async function loadCounters() {
    try {
        const data = await fs.readFile(path.join(__dirname, 'views.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        await fs.writeFile(path.join(__dirname, 'views.json'), JSON.stringify({ "/" : 0, "/about" : 0 }));
        return { "/" : 0, "/about" : 0 };
    }
}

async function saveCounters(counters) {
    await fs.writeFile(path.join(__dirname, 'views.json'), JSON.stringify(counters));
}

app.get('/', async (req, res) => {
    let counters = await loadCounters();
    counters["/"] = (counters["/"] || 0) + 1;
    await saveCounters(counters);
    res.send(`
        <html>
            <head><title>Главная страница</title></head>
            <body>
                <h1>страница 1</h1>
                <p>Просмотры: ${counters["/"]}</p>
                <a href="/about">О нас</a>
            </body>
        </html>
    `);
});

app.get('/about', async (req, res) => {
    let counters = await loadCounters();
    counters["/about"] = (counters["/about"] || 0) + 1;
    await saveCounters(counters);
    res.send(`
        <html>
            <head><title>О нас</title></head>
            <body>
                <h1>страница 2</h1>
                <p>Просмотры: ${counters["/about"]}</p>
                <a href="/">Главная</a>
            </body>
        </html>
    `);
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});