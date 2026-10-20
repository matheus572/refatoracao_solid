const IShippingStrategy = require('../../domain/interfaces/IShippingStrategy');

class NortheastShippingStrategy extends IShippingStrategy {
  calculate(totalWeight) {
    return 45 + totalWeight * 7;
  }
}
module.exports = NortheastShippingStrategy;