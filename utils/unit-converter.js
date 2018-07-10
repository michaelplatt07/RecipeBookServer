const units = require('../consts/unit-constants');

/**
 * ----------------------------------
 * |     NUMBER REPRESENTATIONS     |
 * ----------------------------------
*/
exports.tspToTbsp = (tsp) => {
    return tsp / units.TEASPOONS_IN_TABLESPOON;
}

exports.tbspToTsp = (tbsp) => {
    return tbsp * units.TEASPOONS_IN_TABLESPOON;
}

exports.tspToCup = (tsp) => {
    return tsp / units.TEASPOONS_IN_CUP;
}

exports.cupToTsp = (cup) => {
    return cup * units.TEASPOONS_IN_CUP;
}

exports.tbspToCup = (tbsp) => {
    return tbsp / units.TABLESPOONS_IN_CUP;
}

exports.cupToTbsp = (cup) => {
    return cup * units.TABLESPOONS_IN_CUP;
}

exports.tspToQuart = (tsp) => {
    return tsp / units.TEASPOONS_IN_QUART;
}

exports.quartToTsp = (quart) => {
    return quart * units.TEASPOONS_IN_QUART;
}

exports.tbspToQuart = (tbsp) => {
    return tbsp / units.TABLESPOONS_IN_QUART;
}

exports.quartToTbsp = (quart) => {
    return quart * units.TABLESPOONS_IN_QUART;
}

exports.cupToQuart = (cup) => {
    return cup / units.CUPS_IN_QUART;
}

exports.quartToCup = (quart) => {
    return quart * units.CUPS_IN_QUART;
}

exports.ounceToPound = (ounce) => {
    return ounce / units.OUNCES_IN_POUNDS;
}

exports.poundToOunce = (pound) => {
    return pound * units.OUNCES_IN_POUNDS;
}

/**
 * ----------------------------------
 * |     STRING REPRESENTATIONS     |
 * ----------------------------------
*/

