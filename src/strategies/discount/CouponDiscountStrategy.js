const IDiscountStrategy = require('../../domain/interfaces/IDiscountStrategy');

class CouponDiscountStrategy extends IDiscountStrategy {
  apply(order, subtotal) {
    if (!order.couponCode) return 0;
    if (order.couponCode === 'TECH10') {
      return subtotal * 0.10;
    }
    if (order.couponCode === 'FRETEGRATIS') {
      return 0;
    }
    return 0;
  }
}
module.exports = CouponDiscountStrategy;