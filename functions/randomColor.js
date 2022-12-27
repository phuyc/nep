const colors = [0xED343E, 0x009EEC, 0xC267EC];

function randomColor() {
    return colors[Math.floor(Math.random() * colors.length)];
}

module.exports = randomColor