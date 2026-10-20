const IPaymentStrategy = require('../../domain/interfaces/IPaymentStrategy');

class PixPaymentStrategy extends IPaymentStrategy {
  process(order, subtotal) {
    const paymentStatus = 'approved';
    const discount = subtotal * 0.03; // extra discount
    const paymentFee = 0;
    return { paymentStatus, paymentFee, extraDiscount: discount };
  }
}
module.exports = PixPaymentStrategy;