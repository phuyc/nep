const { REARMS } = require("./emojis");

// Is rearm
function rearmAwkSlug(name) {
    // Awakened or Rearmed
    ar = name.slice(0, 2).toLowerCase().trim();

    // Check for awakened
    if (ar === 'a.') {
        name = 'Awakened ' + name.slice(2);
    }

    // Check for rearms
    else if (ar === 'r.') {
        name = REARMS[name] ?? name;
    };

    return name;
}

module.exports = rearmAwkSlug