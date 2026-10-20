const IShippingStrategy = require('../../domain/interfaces/IShippingStrategy');

class SouthShippingStrategy extends IShippingStrategy {
  calculate(totalWeight) {
    return 28 + totalWeight * 5;
  }
}
module.exports = SouthShippingStrategy;