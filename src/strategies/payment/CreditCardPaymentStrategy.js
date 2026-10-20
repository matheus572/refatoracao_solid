const IPaymentStrategy = require('../../domain/interfaces/IPaymentStrategy');

class CreditCardPaymentStrategy extends IPaymentStrategy {
  process(order, subtotal) {
    const paymentStatus = 'approved';
    let paymentFee = 0;
    if (order.installments && order.installments > 1) {
      paymentFee = subtotal * 0.025;
    }
    return { paymentStatus, paymentFee, extraDiscount: 0 };
  }
}
module.exports = CreditCardPaymentStrategy;