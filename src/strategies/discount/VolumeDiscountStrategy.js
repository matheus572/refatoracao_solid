const IDiscountStrategy = require('../../domain/interfaces/IDiscountStrategy');

class VolumeDiscountStrategy extends IDiscountStrategy {
  apply(order, subtotal) {
    if (subtotal > 8000) {
      return 250;
    }
    return 0;
  }
}
module.exports = VolumeDiscountStrategy;