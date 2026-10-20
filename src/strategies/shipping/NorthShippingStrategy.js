const IShippingStrategy = require('../../domain/interfaces/IShippingStrategy');

class NorthShippingStrategy extends IShippingStrategy {
  calculate(totalWeight) {
    return 60 + totalWeight * 9;
  }
}
module.exports = NorthShippingStrategy;