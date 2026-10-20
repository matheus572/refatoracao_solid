const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const VIPDiscountStrategy = require('../../src/strategies/discount/VIPDiscountStrategy');
const EmployeeDiscountStrategy = require('../../src/strategies/discount/EmployeeDiscountStrategy');
const CouponDiscountStrategy = require('../../src/strategies/discount/CouponDiscountStrategy');
const VolumeDiscountStrategy = require('../../src/strategies/discount/VolumeDiscountStrategy');

function makeOrder({ customerType = null, couponCode = null } = {}) {
  return {
    customer: customerType ? { type: customerType } : null,
    couponCode
  };
}

describe('Discount Strategies', () => {
  const subtotal = 1000;

  test('VIPDiscountStrategy applies 8% for vip', () => {
    const strategy = new VIPDiscountStrategy();
    const order = makeOrder({ customerType: 'vip' });
    const result = strategy.apply(order, subtotal);
    assert.strictEqual(result, subtotal * 0.08);
  });

  test('VIPDiscountStrategy returns 0 for non-vip', () => {
    const strategy = new VIPDiscountStrategy();
    const order = makeOrder({ customerType: 'regular' });
    const result = strategy.apply(order, subtotal);
    assert.strictEqual(result, 0);
  });

  test('EmployeeDiscountStrategy applies 15% for employee', () => {
    const strategy = new EmployeeDiscountStrategy();
    const order = makeOrder({ customerType: 'employee' });
    const result = strategy.apply(order, subtotal);
    assert.strictEqual(result, subtotal * 0.15);
  });

  test('EmployeeDiscountStrategy returns 0 for non-employee', () => {
    const strategy = new EmployeeDiscountStrategy();
    const order = makeOrder({ customerType: 'vip' });
    const result = strategy.apply(order, subtotal);
    assert.strictEqual(result, 0);
  });

  test('CouponDiscountStrategy applies 10% for TECH10', () => {
    const strategy = new CouponDiscountStrategy();
    const order = makeOrder({ couponCode: 'TECH10' });
    const result = strategy.apply(order, subtotal);
    assert.strictEqual(result, subtotal * 0.10);
  });

  test('CouponDiscountStrategy returns 0 for FRETEGRATIS', () => {
    const strategy = new CouponDiscountStrategy();
    const order = makeOrder({ couponCode: 'FRETEGRATIS' });
    const result = strategy.apply(order, subtotal);
    assert.strictEqual(result, 0);
  });

  test('CouponDiscountStrategy returns 0 for unknown coupon', () => {
    const strategy = new CouponDiscountStrategy();
    const order = makeOrder({ couponCode: 'UNKNOWN' });
    const result = strategy.apply(order, subtotal);
    assert.strictEqual(result, 0);
  });

  test('VolumeDiscountStrategy applies 250 when subtotal > 8000', () => {
    const strategy = new VolumeDiscountStrategy();
    const order = makeOrder();
    const result = strategy.apply(order, 9000);
    assert.strictEqual(result, 250);
  });

  test('VolumeDiscountStrategy returns 0 when subtotal <= 8000', () => {
    const strategy = new VolumeDiscountStrategy();
    const order = makeOrder();
    const result = strategy.apply(order, 8000);
    assert.strictEqual(result, 0);
  });
});