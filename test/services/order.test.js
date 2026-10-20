const { test, describe, beforeEach } = require('node:test');
const assert = require('node:assert/strict');
const OrderService = require('../../src/services/OrderService');
const ProductRepository = require('../../src/repositories/ProductRepository');
const OrderRepository = require('../../src/repositories/OrderRepository');
const NotificationService = require('../../src/services/NotificationService');
const Logger = require('../../src/utils/Logger');
const StockService = require('../../src/services/StockService');
const ShippingService = require('../../src/services/ShippingService');
const DiscountService = require('../../src/services/DiscountService');
const PaymentService = require('../../src/services/PaymentService');

const SoutheastShippingStrategy = require('../../src/strategies/shipping/SoutheastShippingStrategy');
const DefaultShippingStrategy = require('../../src/strategies/shipping/DefaultShippingStrategy');

const VIPDiscountStrategy = require('../../src/strategies/discount/VIPDiscountStrategy');
const EmployeeDiscountStrategy = require('../../src/strategies/discount/EmployeeDiscountStrategy');
const CouponDiscountStrategy = require('../../src/strategies/discount/CouponDiscountStrategy');
const VolumeDiscountStrategy = require('../../src/strategies/discount/VolumeDiscountStrategy');

const PixPaymentStrategy = require('../../src/strategies/payment/PixPaymentStrategy');
const CreditCardPaymentStrategy = require('../../src/strategies/payment/CreditCardPaymentStrategy');
const BoletoPaymentStrategy = require('../../src/strategies/payment/BoletoPaymentStrategy');

const Address = require('../../src/domain/Address');
const Customer = require('../../src/domain/Customer');
const Order = require('../../src/domain/Order');
const OrderItem = require('../../src/domain/OrderItem');

describe('OrderService integration', () => {
  let orderService;

  beforeEach(() => {
    const productRepository = new ProductRepository();
    const orderRepository = new OrderRepository();
    const stockService = new StockService(productRepository);

    const shippingStrategies = {
      sudeste: new SoutheastShippingStrategy()
    };
    const shippingService = new ShippingService(shippingStrategies, new DefaultShippingStrategy());

    const discountStrategies = [
      new VIPDiscountStrategy(),
      new EmployeeDiscountStrategy(),
      new CouponDiscountStrategy(),
      new VolumeDiscountStrategy()
    ];
    const discountService = new DiscountService(discountStrategies);

    const paymentStrategies = {
      pix: new PixPaymentStrategy(),
      credit_card: new CreditCardPaymentStrategy(),
      boleto: new BoletoPaymentStrategy()
    };
    const paymentService = new PaymentService(paymentStrategies);

    const notificationService = new NotificationService();
    const logger = new Logger();

    orderService = new OrderService({
      orderRepository,
      productRepository,
      stockService,
      shippingService,
      discountService,
      paymentService,
      notificationService,
      logger
    });
  });

  test('processes a full order matching original behavior', () => {
    const customer = new Customer(
      'c1',
      'Ana Souza',
      'ana.souza@example.com',
      '18999990000',
      'vip',
      new Address('Rua das Palmeiras', '120', 'Presidente Prudente', 'SP', '19000-000', 'sudeste')
    );

    const productRepository = new ProductRepository();
    const notebook = productRepository.findById('p1');
    const mouse = productRepository.findById('p2');

    const order = new Order(
      'o1001',
      customer,
      [new OrderItem(notebook, 1), new OrderItem(mouse, 2)],
      'TECH10',
      'credit_card',
      3
    );

    const result = orderService.process(order);

    assert.strictEqual(result.id, 'o1001');
    assert.strictEqual(result.customerEmail, 'ana.souza@example.com');
    assert.strictEqual(result.subtotal, 6440);
    assert.strictEqual(result.discount, 1159.2);
    assert.strictEqual(result.freight, 30);
    assert.strictEqual(result.paymentFee, 161);
    assert.strictEqual(result.total, 5471.8);
    assert.strictEqual(result.status, 'confirmed');
  });

  test('processes pix payment with extra discount', () => {
    const customer = new Customer(
      'c2',
      'Bob',
      'bob@example.com',
      '11999999999',
      'regular',
      new Address('Rua X', '1', 'Sao Paulo', 'SP', '01000-000', 'sudeste')
    );

    const productRepository = new ProductRepository();
    const mouse = productRepository.findById('p2');

    const order = new Order(
      'o1002',
      customer,
      [new OrderItem(mouse, 1)],
      null,
      'pix',
      1
    );

    const result = orderService.process(order);
    // subtotal 120, no vip, no coupon, no volume => discount 0, but pix extra 3% = 3.6
    // freight for 0.2 weight = 20 + 0.2*4 = 20.8
    // total = 120 - 3.6 + 20.8 = 137.2
    assert.strictEqual(result.subtotal, 120);
    assert.strictEqual(result.discount, 3.6);
    assert.strictEqual(result.freight, 20.8);
    assert.strictEqual(result.paymentFee, 0);
    assert.strictEqual(result.total, 137.2);
    assert.strictEqual(result.status, 'confirmed');
  });

  test('processes boleto waiting payment', () => {
    const customer = new Customer(
      'c3',
      'Carol',
      'carol@example.com',
      '11988888888',
      'employee',
      new Address('Rua Y', '2', 'Rio de Janeiro', 'RJ', '20000-000', 'sudeste')
    );

    const productRepository = new ProductRepository();
    const mouse = productRepository.findById('p2');

    const order = new Order(
      'o1003',
      customer,
      [new OrderItem(mouse, 1)],
      null,
      'boleto',
      1
    );

    const result = orderService.process(order);
    assert.strictEqual(result.status, 'waiting_payment');
    // employee discount 15% of 120 =18
    // freight 20.8
    // total = 120 -18 +20.8 =122.8
    assert.strictEqual(result.discount, 18);
    assert.strictEqual(result.total, 122.8);
  });
});