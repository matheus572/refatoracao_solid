const IShippingStrategy = require('../../domain/interfaces/IShippingStrategy');

class DefaultShippingStrategy extends IShippingStrategy {
  calculate(totalWeight) {
    return 50 + totalWeight * 8;
  }
}
module.exports = DefaultShippingStrategy;