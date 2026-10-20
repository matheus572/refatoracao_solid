const IDiscountStrategy = require('../../domain/interfaces/IDiscountStrategy');

class VIPDiscountStrategy extends IDiscountStrategy {
  apply(order, subtotal) {
    if (order.customer && order.customer.type === 'vip') {
      return subtotal * 0.08;
    }
    return 0;
  }
}
module.exports = VIPDiscountStrategy;