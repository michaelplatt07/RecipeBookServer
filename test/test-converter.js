var expect = require('chai').expect;

var unitConverter = require('../utils/unit-converter');

describe('ouncesToPounds()', function () {
  it('Convert ounces to a pounds decimal represenation', function () {
      var ounces = 16;
      var expectedPounds = 1;

      var pounds = unitConverter.ouncesToPounds(ounces);;

      expect(pounds).to.be.equal(expectedPounds);
  });
});


describe('ouncesToPounds()', function () {
  it('Convert ounces to a pounds decimal represenation', function () {
      var ounces = 18;
      var expectedPounds = 1.125;

      var pounds = unitConverter.ouncesToPounds(ounces);;

      expect(pounds).to.be.equal(expectedPounds);
  });
});


describe('ouncesToPounds()', function () {
  it('Convert ounces to a pounds decimal represenation', function () {
      var ounces = 42;
      var expectedPounds = 2.625;

      var pounds = unitConverter.ouncesToPounds(ounces);;

      expect(pounds).to.be.equal(expectedPounds);
  });
});


describe('ouncesToPoundsString()', function () {
  it('Convert ounces to a pounds string format', function () {
      var ounces = 16;
      var expectedPounds = "1 lbs 0 oz";

      var pounds = unitConverter.ouncesToPoundsString(ounces);;

      expect(pounds).to.be.equal(expectedPounds);
  });
});


describe('ouncesToPoundsString()', function () {
  it('Convert ounces to a pounds string format', function () {
      var ounces = 18;
      var expectedPounds = "1 lbs 2 oz";

      var pounds = unitConverter.ouncesToPoundsString(ounces);;

      expect(pounds).to.be.equal(expectedPounds);
  });
});


describe('ouncesToPoundsString()', function () {
  it('Convert ounces to a pounds string format', function () {
      var ounces = 42;
      var expectedPounds = "2 lbs 10 oz";

      var pounds = unitConverter.ouncesToPoundsString(ounces);;

      expect(pounds).to.be.equal(expectedPounds);
  });
});


describe('poundsToOunces()', function () {
  it('Convert pounds to a ounces', function () {
      var pounds = 1;
      var expectedOunces = 16;

      var ounces = unitConverter.poundsToOunces(pounds);;

      expect(ounces).to.be.equal(expectedOunces);
  });
});


describe('poundsToOunces()', function () {
  it('Convert pounds to ounces', function () {
      var pounds = 1.125;
      var expectedOunces = 18;

      var ounces = unitConverter.poundsToOunces(pounds);;

      expect(ounces).to.be.equal(expectedOunces);
  });
});


describe('poundsToOunces()', function () {
  it('Convert pounds to ounces', function () {
      var pounds = 2.625;
      var expectedOunces = 42;

      var ounces = unitConverter.poundsToOunces(pounds);;

      expect(ounces).to.be.equal(expectedOunces);
  });
});


describe('poundsToOuncesString()', function () {
  it('Return string representation of ounces', function () {
      var pounds = 1;
      var expectedOunces = "16 oz";

      var ounces = unitConverter.poundsToOuncesString(pounds);;

      expect(ounces).to.be.equal(expectedOunces);
  });
});


describe('poundsToOuncesString()', function () {
  it('Return string representation of ounces', function () {
      var pounds = 1.125;
      var expectedOunces = "18 oz";

      var ounces = unitConverter.poundsToOuncesString(pounds);;

      expect(ounces).to.be.equal(expectedOunces);
  });
});


describe('poundsToOuncesString()', function () {
  it('Return string representation of ounces', function () {
      var pounds = 2.625;
      var expectedOunces = "42 oz";

      var ounces = unitConverter.poundsToOuncesString(pounds);;

      expect(ounces).to.be.equal(expectedOunces);
  });
});


describe('fuildOuncesToCups()', function() {
    it('Return decimal representation of fluid ounces in cups', function() {
	var fluidOunces = 8;
	var expectedCups = 1;

	var cups = unitConverter.fluidOuncesToCups(fluidOunces);

	expect(cups).to.be.equal(expectedCups);
    });
});


describe('fuildOuncesToCups()', function() {
    it('Return decimal representation of fluid ounces in cups', function() {
	var fluidOunces = 13;
	var expectedCups = 1.625;

	var cups = unitConverter.fluidOuncesToCups(fluidOunces);

	expect(cups).to.be.equal(expectedCups);
    });
});


describe('cupsToFluidOunces()', function() {
    it('Return covernsion of fluid ounces to decimal', function() {
	var cups = 1;
	var expectedFluidOunces = 8;

	var fluidOunces = unitConverter.cupsToFluidOunces(cups);

	expect(fluidOunces).to.be.equal(expectedFluidOunces);
    });
});


describe('cupsToFluidOunces()', function() {
    it('Return covernsion of fluid ounces to decimal', function() {
	var cups = 1.625;
	var expectedFluidOunces = 13;

	var fluidOunces = unitConverter.cupsToFluidOunces(cups);

	expect(fluidOunces).to.be.equal(expectedFluidOunces);
    });
});


describe('fluidOuncesToQuarts()', function() {
    it('Return coversion of fluid ounces to cups', function() {
	var fluidOunces = 32;
	var expectedQuarts = 1;

	var quarts = unitConverter.fluidOuncesToQuarts(fluidOunces);

	expect(quarts).to.be.equal(expectedQuarts);
    });
});


describe('fluidOuncesToQuarts()', function() {
    it('Return coversion of fluid ounces to cups', function() {
	var fluidOunces = 46;
	var expectedQuarts = 1.4375;

	var quarts = unitConverter.fluidOuncesToQuarts(fluidOunces);

	expect(quarts).to.be.equal(expectedQuarts);
    });
});


describe('quartsToFluidOunces()', function() {
    it('Return conversion of quarts to fluid ounces', function() {
	var quarts = 1;
	var expectedFluidOunces = 32;

	var fluidOunces = unitConverter.quartsToFluidOunces(quarts);

	expect(fluidOunces).to.be.equal(expectedFluidOunces);
    });
});


describe('quartsToFluidOunces()', function() {
    it('Return conversion of quarts to fluid ounces', function() {
	var quarts = 1.4375;
	var expectedFluidOunces = 46;

	var fluidOunces = unitConverter.quartsToFluidOunces(quarts);

	expect(fluidOunces).to.be.equal(expectedFluidOunces);
    });
});
