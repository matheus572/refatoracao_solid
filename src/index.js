const Address = require("./domain/Address");
const Customer = require("./domain/Customer");
const Order = require("./domain/Order");
const OrderItem = require("./domain/OrderItem");
const OrderService = require("./services/OrderService");
const ProductRepository = require("./repositories/ProductRepository");
const OrderRepository = require("./repositories/OrderRepository");
const NotificationService = require("./services/NotificationService");
const Logger = require("./utils/Logger");
const StockService = require("./services/StockService");
const ShippingService = require("./services/ShippingService");
const DiscountService = require("./services/DiscountService");
const PaymentService = require("./services/PaymentService");

// Strategies
const SoutheastShippingStrategy = require("./strategies/shipping/SoutheastShippingStrategy");
const SouthShippingStrategy = require("./strategies/shipping/SouthShippingStrategy");
const CentralWestShippingStrategy = require("./strategies/shipping/CentralWestShippingStrategy");
const NortheastShippingStrategy = require("./strategies/shipping/NortheastShippingStrategy");
const NorthShippingStrategy = require("./strategies/shipping/NorthShippingStrategy");
const DefaultShippingStrategy = require("./strategies/shipping/DefaultShippingStrategy");

const VIPDiscountStrategy = require("./strategies/discount/VIPDiscountStrategy");
const EmployeeDiscountStrategy = require("./strategies/discount/EmployeeDiscountStrategy");
const CouponDiscountStrategy = require("./strategies/discount/CouponDiscountStrategy");
const VolumeDiscountStrategy = require("./strategies/discount/VolumeDiscountStrategy");

const PixPaymentStrategy = require("./strategies/payment/PixPaymentStrategy");
const CreditCardPaymentStrategy = require("./strategies/payment/CreditCardPaymentStrategy");
const BoletoPaymentStrategy = require("./strategies/payment/BoletoPaymentStrategy");

// Repositories
const productRepository = new ProductRepository();
const orderRepository = new OrderRepository();

// Services
const stockService = new StockService(productRepository);

const shippingStrategies = {
  sudeste: new SoutheastShippingStrategy(),
  sul: new SouthShippingStrategy(),
  'centro-oeste': new CentralWestShippingStrategy(),
  nordeste: new NortheastShippingStrategy(),
  norte: new NorthShippingStrategy()
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

const orderService = new OrderService({
  orderRepository,
  productRepository,
  stockService,
  shippingService,
  discountService,
  paymentService,
  notificationService,
  logger
});

// Sample data
const customer = new Customer(
  "c1",
  "Ana Souza",
  "ana.souza@example.com",
  "18999990000",
  "vip",
  new Address("Rua das Palmeiras", "120", "Presidente Prudente", "SP", "19000-000", "sudeste")
);

const notebook = productRepository.findById("p1");
const mouse = productRepository.findById("p2");

const order = new Order(
  "o1001",
  customer,
  [new OrderItem(notebook, 1), new OrderItem(mouse, 2)],
  "TECH10",
  "credit_card",
  3
);

const result = orderService.process(order);

console.log(JSON.stringify(result, null, 2));