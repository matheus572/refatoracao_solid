const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const SoutheastShippingStrategy = require('../../src/strategies/shipping/SoutheastShippingStrategy');
const SouthShippingStrategy = require('../../src/strategies/shipping/SouthShippingStrategy');
const CentralWestShippingStrategy = require('../../src/strategies/shipping/CentralWestShippingStrategy');
const NortheastShippingStrategy = require('../../src/strategies/shipping/NortheastShippingStrategy');
const NorthShippingStrategy = require('../../src/strategies/shipping/NorthShippingStrategy');
const DefaultShippingStrategy = require('../../src/strategies/shipping/DefaultShippingStrategy');

describe('Shipping Strategies', () => {
  const weight = 2.5;

  test('SoutheastShippingStrategy calculates correctly', () => {
    const strategy = new SoutheastShippingStrategy();
    const result = strategy.calculate(weight);
    assert.strictEqual(result, 20 + weight * 4);
  });

  test('SouthShippingStrategy calculates correctly', () => {
    const strategy = new SouthShippingStrategy();
    const result = strategy.calculate(weight);
    assert.strictEqual(result, 28 + weight * 5);
  });

  test('CentralWestShippingStrategy calculates correctly', () => {
    const strategy = new CentralWestShippingStrategy();
    const result = strategy.calculate(weight);
    assert.strictEqual(result, 35 + weight * 6);
  });

  test('NortheastShippingStrategy calculates correctly', () => {
    const strategy = new NortheastShippingStrategy();
    const result = strategy.calculate(weight);
    assert.strictEqual(result, 45 + weight * 7);
  });

  test('NorthShippingStrategy calculates correctly', () => {
    const strategy = new NorthShippingStrategy();
    const result = strategy.calculate(weight);
    assert.strictEqual(result, 60 + weight * 9);
  });

  test('DefaultShippingStrategy calculates correctly', () => {
    const strategy = new DefaultShippingStrategy();
    const result = strategy.calculate(weight);
    assert.strictEqual(result, 50 + weight * 8);
  });
});