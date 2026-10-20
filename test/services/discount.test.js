const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const DiscountService = require('../../src/services/DiscountService');
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

describe('DiscountService', () => {
  let discountService;

  beforeEach(() => {
    const strategies = [
      new VIPDiscountStrategy(),
      new EmployeeDiscountStrategy(),
      new CouponDiscountStrategy(),
      new VolumeDiscountStrategy()
    ];
    discountService = new DiscountService(strategies);
  });

  test('sums multiple applicable discounts', () => {
    const order = makeOrder({ customerType: 'vip', couponCode: 'TECH10' });
    const subtotal = 1000;
    const discount = discountService.calculate(order, subtotal);
    // VIP 8% =80, TECH10 10% =100 => total 180
    assert.strictEqual(discount, 180);
  });

  test('applies volume discount when subtotal >8000', () => {
    const order = makeOrder({ customerType: 'vip' });
    const subtotal = 9000;
    const discount = discountService.calculate(order, subtotal);
    // VIP 8% =720, volume 250 => 970
    assert.strictEqual(discount, 970);
  });

  test('FRETEGRATIS coupon gives no discount', () => {
    const order = makeOrder({ couponCode: 'FRETEGRATIS' });
    const subtotal = 1000;
    const discount = discountService.calculate(order, subtotal);
    assert.strictEqual(discount, 0);
  });
});