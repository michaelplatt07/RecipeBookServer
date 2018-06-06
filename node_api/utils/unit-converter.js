/**
 * ----------------------------------
 * |     NUMBER REPRESENTATIONS     |
 * ----------------------------------
*/


/**
 * ----------------
 * |     MASS     |
 * ----------------
*/
exports.ouncesToPounds = (ounces) => {
    return ounces / 16;
}

exports.poundsToOunces = (pounds) => {
    return pounds * 16;
}


/**
 * ------------------
 * |     LIQUID     |
 * ------------------
*/
exports.fluidOuncesToCups = (fluidOunces) => {
    return fluidOunces / 8;
}

exports.cupsToFluidOunces = (cups) => {
    return cups * 8;
}

exports.fluidOuncesToQuarts = (fluidOunces) => {
    return fluidOunces / 32;
}

exports.quartsToFluidOunces = (quarts) => {
    return quarts * 32;
}


/**
 * ----------------------------------
 * |     STRING REPRESENTATIONS     |
 * ----------------------------------
*/


/**
 * ----------------
 * |     MASS     |
 * ----------------
*/
exports.ouncesToPoundsString = (ounces) => {
    return Math.floor(ounces / 16) + " lbs " + ounces % 16 + " oz";
}

exports.poundsToOuncesString = (pounds) => {
    return pounds * 16 + " oz";
}


/**
 * ------------------
 * |     LIQUID     |
 * ------------------
*/
