export var DecimalPrecision2 = (function () {
  if (Number.EPSILON === undefined) {
    Number.EPSILON = Math.pow(2, -52);
  }
  if (Math.sign === undefined) {
    Math.sign = function (x) {
      return (x > 0) - (x < 0) || +x;
    };
  }
  return {
    // Decimal round (half away from zero)
    round: function (num, decimalPlaces) {
      var p = Math.pow(10, decimalPlaces || 0);
      var n = num * p * (1 + Number.EPSILON);
      return Math.round(n) / p;
    },
    round2: function (num) {
      var p = Math.pow(10, 2);
      var n = num * p * (1 + Number.EPSILON);
      return Math.round(n) / p;
    },
    // Decimal ceil
    ceil: function (num, decimalPlaces) {
      var p = Math.pow(10, decimalPlaces || 0);
      var n = num * p * (1 - Math.sign(num) * Number.EPSILON);
      return Math.ceil(n) / p;
    },
    // Decimal floor
    floor: function (num, decimalPlaces) {
      var p = Math.pow(10, decimalPlaces || 0);
      var n = num * p * (1 + Math.sign(num) * Number.EPSILON);
      return Math.floor(n) / p;
    },
    // Decimal trunc
    trunc: function (num, decimalPlaces) {
      return (num < 0 ? this.ceil : this.floor)(num, decimalPlaces);
    },
    // Format using fixed-point notation
    toFixed: function (num, decimalPlaces) {
      return this.round(num, decimalPlaces).toFixed(decimalPlaces);
    },
  };
})();
