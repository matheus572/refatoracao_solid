const IShippingStrategy = require('../../domain/interfaces/IShippingStrategy');

class SoutheastShippingStrategy extends IShippingStrategy {
  calculate(totalWeight) {
    return 20 + totalWeight * 4;
  }
}
module.exports = SoutheastShippingStrategy;