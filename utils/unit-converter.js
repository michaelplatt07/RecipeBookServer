const units = require('../consts/unit-constants');

exports.convertMeasurement = (aMeasurement, unitFrom, unitTo) => {
    if (unitFrom == 'tsp')
    {
	switch (unitTo) {
	case 'Tbsp':
	    return this.tspToTbsp(aMeasurement);
	case 'c':
	    return this.tspToCup(aMeasurement);
	case 'q':
	    return this.tspToQuart(aMeasurement);
	default:
	    console.log(unitFrom + " to " + unitTo + " does not exist.");
	}
    }
    else if (unitFrom == 'Tbsp')
    {
	switch (unitTo) {
	case 'tsp':
	    return this.tbspToTsp(aMeasurement);
	case 'c':
	    return this.tbspToCup(aMeasurement);
	case 'q':
	    return this.tbspToQuart(aMeasurement);
	default:
	    console.log(unitFrom + " to " + unitTo + " does not exist.");
	}
    }
    else if (unitFrom == 'c')
    {
	switch (unitTo) {
	case 'tsp':
	    return this.cupToTsp(aMeasurement);
	case 'Tbsp':
	    return this.cupToTbsp(aMeasurement);
	case 'q':
	    return this.cupToQuart(aMeasurement);
	default:
	    console.log(unitFrom + " to " + unitTo + " does not exist.");
	}
    }
    else if (unitFrom == 'q')
    {
	switch (unitTo) {
	case 'tsp':
	    return this.quartToTsp(aMeasurement);
	case 'Tbsp':
	    return this.quartToTbsp(aMeasurement);
	case 'c':
	    return this.quartToCup(aMeasurement);
	default:
	    console.log(unitFrom + " to " + unitTo + " does not exist.");
	}
    }
    else if (unitFrom == 'lb')
    {
	switch (unitTo) {
	case 'oz':
	    return this.poundToOunce(aMeasurement);
	default:
	    console.log(unitFrom + " to " + unitTo + " does not exist.");
	}
    }
    else if (unitFrom == 'oz')
    {
	switch (unitTo) {
	case 'lb':
	    return this.ounceToPound(aMeasurement);
	default:
	    console.log(unitFrom + " to " + unitTo + " does not exist.");
	}
    }
    else
    {
	// TODO(map) : Think about maybe throwing an error here instead.
	console.log(unitFrom + " to " + unitTo + " does not exist.");
    }
}

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

