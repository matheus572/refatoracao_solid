const IShippingStrategy = require('../../domain/interfaces/IShippingStrategy');

class CentralWestShippingStrategy extends IShippingStrategy {
  calculate(totalWeight) {
    return 35 + totalWeight * 6;
  }
}
module.exports = CentralWestShippingStrategy;