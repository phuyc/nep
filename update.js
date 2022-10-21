const Database = require("better-sqlite3");
const fetch = require("node-fetch");
const db = new Database("./employees.db");

async function autoUpdate() {

    // Operators
    let operators = await fetch("https://www.prydwen.gg/page-data/counter-side/operators/page-data.json");
    let json = await operators.json();
    json = json.result.data.allOperators.nodes;

    for (let i = 0; i < json.length; i++) {
        db.prepare("INSERT OR IGNORE INTO operators (name, slug, rarity) VALUES (?, ?, ?);").run(json[i].fullName, json[i].slug, json[i].rarity);
    }

    // Employees
    let units = await fetch("https://www.prydwen.gg/page-data/counter-side/characters/page-data.json");
    let json2 = await units.json();
    json2 = json2.result.data.allEmployees.nodes;

    for (let i = 0; i < json2.length; i++) {
        db.prepare("INSERT OR IGNORE INTO employees (name, slug, rarity) VALUES (?, ?, ?);").run(json2[i].fullName, json2[i].slug, json2[i].rarity);
    }

/*
    // Skins
    let skins = await fetch("https://www.prydwen.gg/page-data/counter-side/database/skins/page-data.json");
    let json3 = await skins.json();
    json3 = json3.result.data.allEmployeeSkins.nodes;

    for (let i = 0; i < json3.length; i++) {
        db.prepare("REPLACE INTO skins (name, slug, rarity) VALUES (?, ?, ?);").run(json3[i].fullName, json3[i].slug, json3[i].rarity);
    }
*/

    // Ships
    let ships = await fetch("https://www.prydwen.gg/page-data/counter-side/ships/page-data.json");
    let json4 = await ships.json();
    json4 = json4.result.data.allShips.nodes;

    for (let i = 0; i < json4.length; i++) {
        db.prepare("INSERT OR IGNORE INTO ships (name, slug, rarity) VALUES (?, ?, ?);").run(json4[i].fullName, json4[i].slug, json4[i].rarity);
    }
}

module.exports = autoUpdate;