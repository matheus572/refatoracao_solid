const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const ShippingService = require('../../src/services/ShippingService');
const SoutheastShippingStrategy = require('../../src/strategies/shipping/SoutheastShippingStrategy');
const DefaultShippingStrategy = require('../../src/strategies/shipping/DefaultShippingStrategy');

function makeOrder({ region = 'sudeste', couponCode = null, totalWeight = 2.5 } = {}) {
  return {
    customer: {
      address: { region }
    },
    couponCode,
    getTotalWeight() { return totalWeight; }
  };
}

describe('ShippingService', () => {
  let shippingService;

  beforeEach(() => {
    const strategies = {
      sudeste: new SoutheastShippingStrategy()
    };
    shippingService = new ShippingService(strategies, new DefaultShippingStrategy());
  });

  test('uses region strategy', () => {
    const order = makeOrder({ region: 'sudeste' });
    const freight = shippingService.calculate(order);
    // 20 + 2.5*4 = 30
    assert.strictEqual(freight, 30);
  });

  test('falls back to default strategy for unknown region', () => {
    const order = makeOrder({ region: 'unknown' });
    const freight = shippingService.calculate(order);
    // default: 50 + 2.5*8 = 70
    assert.strictEqual(freight, 70);
  });

  test('applies FRETEGRATIS coupon zeroes freight', () => {
    const order = makeOrder({ region: 'sudeste', couponCode: 'FRETEGRATIS' });
    const freight = shippingService.calculate(order);
    assert.strictEqual(freight, 0);
  });
});