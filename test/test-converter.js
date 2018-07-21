var expect = require('chai').expect;

var unitConverter = require('../utils/unit-converter');


describe('tspToTbsp() number', function () {
  it('Should convert tsp to tbsp', function () {
      var tsp = 3;
      var expectedTbsp = 1;

      var tbsp = unitConverter.convertMeasurement(tsp, 'tsp', 'Tbsp');

      expect(tbsp).to.be.equal(expectedTbsp);
  });
});

describe('tbspToTsp() number', function () {
  it('Should convert tbsp to tsp', function () {
      var tbsp = 1;
      var expectedTsp = 3;

      var tsp = unitConverter.convertMeasurement(tbsp, 'Tbsp', 'tsp');

      expect(tsp).to.be.equal(expectedTsp);
  });
});

describe('tspToCup() number', function () {
  it('Should convert tsp to cup', function () {
      var tsp = 48;
      var expectedCup = 1;

      var cup = unitConverter.convertMeasurement(tsp, 'tsp', 'c');

      expect(cup).to.be.equal(expectedCup);
  });
});

describe('cupToTsp() number', function () {
  it('Should convert cup to tsp', function () {
      var cup = 1;
      var expectedTsp = 48;

      var tsp = unitConverter.convertMeasurement(cup, 'c', 'tsp');

      expect(tsp).to.be.equal(expectedTsp);
  });
});

describe('tbspToCup() number', function () {
  it('Should convert tbsp to cup', function () {
      var tbsp = 16;
      var expectedCup = 1;

      var cup = unitConverter.convertMeasurement(tbsp, 'Tbsp', 'c');

      expect(cup).to.be.equal(expectedCup);
  });
});

describe('cupToTbsp() number', function () {
  it('Should convert cup to tbsp', function () {
      var cup = 1;
      var expectedTbsp = 16;

      var tbsp = unitConverter.convertMeasurement(cup, 'c', 'Tbsp');

      expect(tbsp).to.be.equal(expectedTbsp);
  });
});

describe('tspToQuart() number', function () {
  it('Should convert tsp to quart', function () {
      var tsp = 192;
      var expectedQuart = 1;

      var quart = unitConverter.convertMeasurement(tsp, 'tsp', 'q');

      expect(quart).to.be.equal(expectedQuart);
  });
});

describe('quartToTsp() number', function () {
  it('Should convert quart to tsp', function () {
      var quart = 1;
      var expectedTsp = 192;

      var tsp = unitConverter.convertMeasurement(quart, 'q', 'tsp');

      expect(tsp).to.be.equal(expectedTsp);
  });
});

describe('tbpsToQuart() number', function () {
  it('Should convert tbps to quart', function () {
      var tbsp = 64;
      var expectedQuart = 1;

      var quart = unitConverter.convertMeasurement(tbsp, 'Tbsp', 'q');

      expect(quart).to.be.equal(expectedQuart);
  });
});

describe('quartToTbsp() number', function () {
  it('Should convert quart to tbsp', function () {
      var quart = 1;
      var expectedTbsp = 64;

      var tbsp = unitConverter.convertMeasurement(quart, 'q', 'Tbsp');

      expect(tbsp).to.be.equal(expectedTbsp);
  });
});

describe('cupToQuart() number', function () {
  it('Should convert cup to quart', function () {
      var cup = 4;
      var expectedQuart = 1;

      var quart = unitConverter.convertMeasurement(cup, 'c', 'q');

      expect(quart).to.be.equal(expectedQuart);
  });
});

describe('quartToCup() number', function () {
  it('Should convert quart to cup', function () {
      var quart = 1;
      var expectedCup = 4;

      var cup = unitConverter.convertMeasurement(quart, 'q', 'c');

      expect(cup).to.be.equal(expectedCup);
  });
});

describe('ounceToPound() number', function () {
  it('Should convert ounce to pound', function () {
      var ounce = 16;
      var expectedPound = 1;

      var pound = unitConverter.convertMeasurement(ounce, 'oz', 'lb');

      expect(pound).to.be.equal(expectedPound);
  });
});

describe('poundToOunce() number', function () {
  it('Should convert pound to ounce', function () {
      var pound = 1;
      var expectedOunce = 16;

      var ounce = unitConverter.convertMeasurement(pound, 'lb', 'oz');

      expect(ounce).to.be.equal(expectedOunce);
  });
});
