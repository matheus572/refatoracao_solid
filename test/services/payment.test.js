const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const PaymentService = require('../../src/services/PaymentService');
const PixPaymentStrategy = require('../../src/strategies/payment/PixPaymentStrategy');
const CreditCardPaymentStrategy = require('../../src/strategies/payment/CreditCardPaymentStrategy');
const BoletoPaymentStrategy = require('../../src/strategies/payment/BoletoPaymentStrategy');

function makeOrder({ paymentMethod = 'pix', installments = 1 } = {}) {
  return { paymentMethod, installments };
}

describe('PaymentService', () => {
  let paymentService;

  beforeEach(() => {
    const strategies = {
      pix: new PixPaymentStrategy(),
      credit_card: new CreditCardPaymentStrategy(),
      boleto: new BoletoPaymentStrategy()
    };
    paymentService = new PaymentService(strategies);
  });

  test('processes pix payment', () => {
    const order = makeOrder({ paymentMethod: 'pix' });
    const subtotal = 1000;
    const result = paymentService.process(order, subtotal);
    assert.strictEqual(result.paymentStatus, 'approved');
    assert.strictEqual(result.paymentFee, 0);
    assert.strictEqual(result.extraDiscount, 30); // 3%
  });

  test('processes credit_card with installments', () => {
    const order = makeOrder({ paymentMethod: 'credit_card', installments: 3 });
    const subtotal = 1000;
    const result = paymentService.process(order, subtotal);
    assert.strictEqual(result.paymentStatus, 'approved');
    assert.strictEqual(result.paymentFee, 25); // 2.5%
    assert.strictEqual(result.extraDiscount, 0);
  });

  test('processes credit_card single installment no fee', () => {
    const order = makeOrder({ paymentMethod: 'credit_card', installments: 1 });
    const subtotal = 1000;
    const result = paymentService.process(order, subtotal);
    assert.strictEqual(result.paymentFee, 0);
  });

  test('processes boleto', () => {
    const order = makeOrder({ paymentMethod: 'boleto' });
    const subtotal = 1000;
    const result = paymentService.process(order, subtotal);
    assert.strictEqual(result.paymentStatus, 'waiting_payment');
    assert.strictEqual(result.paymentFee, 0);
    assert.strictEqual(result.extraDiscount, 0);
  });

  test('throws for unknown payment method', () => {
    const order = makeOrder({ paymentMethod: 'unknown' });
    assert.throws(() => paymentService.process(order, 100), /Forma de pagamento invalida/);
  });
});