const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const PixPaymentStrategy = require('../../src/strategies/payment/PixPaymentStrategy');
const CreditCardPaymentStrategy = require('../../src/strategies/payment/CreditCardPaymentStrategy');
const BoletoPaymentStrategy = require('../../src/strategies/payment/BoletoPaymentStrategy');

function makeOrder({ paymentMethod = 'pix', installments = 1 } = {}) {
  return { paymentMethod, installments };
}

describe('Payment Strategies', () => {
  const subtotal = 1000;

  test('PixPaymentStrategy returns approved, no fee, extra discount 3%', () => {
    const strategy = new PixPaymentStrategy();
    const order = makeOrder({ paymentMethod: 'pix' });
    const result = strategy.process(order, subtotal);
    assert.strictEqual(result.paymentStatus, 'approved');
    assert.strictEqual(result.paymentFee, 0);
    assert.strictEqual(result.extraDiscount, subtotal * 0.03);
  });

  test('CreditCardPaymentStrategy approved, fee 2.5% when installments >1', () => {
    const strategy = new CreditCardPaymentStrategy();
    const order = makeOrder({ paymentMethod: 'credit_card', installments: 3 });
    const result = strategy.process(order, subtotal);
    assert.strictEqual(result.paymentStatus, 'approved');
    assert.strictEqual(result.paymentFee, subtotal * 0.025);
    assert.strictEqual(result.extraDiscount, 0);
  });

  test('CreditCardPaymentStrategy approved, no fee when installments =1', () => {
    const strategy = new CreditCardPaymentStrategy();
    const order = makeOrder({ paymentMethod: 'credit_card', installments: 1 });
    const result = strategy.process(order, subtotal);
    assert.strictEqual(result.paymentFee, 0);
  });

  test('BoletoPaymentStrategy returns waiting_payment, no fee', () => {
    const strategy = new BoletoPaymentStrategy();
    const order = makeOrder({ paymentMethod: 'boleto' });
    const result = strategy.process(order, subtotal);
    assert.strictEqual(result.paymentStatus, 'waiting_payment');
    assert.strictEqual(result.paymentFee, 0);
    assert.strictEqual(result.extraDiscount, 0);
  });
});