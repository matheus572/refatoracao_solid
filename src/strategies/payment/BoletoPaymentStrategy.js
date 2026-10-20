const IPaymentStrategy = require('../../domain/interfaces/IPaymentStrategy');

class BoletoPaymentStrategy extends IPaymentStrategy {
  process(order, subtotal) {
    const paymentStatus = 'waiting_payment';
    const paymentFee = 0;
    return { paymentStatus, paymentFee, extraDiscount: 0 };
  }
}
module.exports = BoletoPaymentStrategy;