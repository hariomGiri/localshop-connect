# LocalShop Connect - System Design Document

## Implementation Approach

Based on the requirements outlined in the PRD, LocalShop Connect requires a robust architecture that supports multiple stakeholders, real-time updates, location-based services, and scalable infrastructure. We'll implement a microservices-based architecture to ensure modularity, scalability, and maintainability.

### Key Technical Challenges and Solutions

1. **Multi-Stakeholder Platform**: Supporting different user roles (shopkeepers, customers, admins, delivery partners) with unique interfaces and permissions
   - Solution: Role-based access control with JWT authentication and separate frontend interfaces per role

2. **Geolocation and Proximity Search**: Enabling efficient discovery of nearby shops and products
   - Solution: MongoDB geospatial indexing + Google Maps API integration

3. **Real-Time Updates**: Providing live updates for order status, inventory changes, and notifications
   - Solution: Socket.io for real-time communications

4. **Payment Processing**: Secure handling of transactions
   - Solution: Integration with Stripe/Razorpay with PCI-DSS compliance

5. **Performance at Scale**: Handling growing number of users, products, and transactions
   - Solution: Horizontal scaling, caching strategies, and optimized database queries

### Selected Technology Stack

**Frontend:**
- React.js with Next.js for server-side rendering and SEO optimization
- Redux Toolkit for state management
- React Query for server state and caching
- Tailwind CSS for styling
- Socket.io Client for real-time features

**Backend:**
- Node.js with Express.js for API services
- Socket.io for real-time communication
- Bull.js for job queue management

**Databases:**
- PostgreSQL for relational data (users, transactions, relationships)
- MongoDB for product catalogs and geospatial queries
- Redis for caching and session management

**Infrastructure:**
- AWS EC2 for hosting
- AWS S3 for media storage
- AWS CloudFront for content delivery
- Docker + Kubernetes for containerization and orchestration

**Third-Party Services:**
- Google Maps API for location services
- Stripe/Razorpay for payment processing
- Firebase Cloud Messaging for push notifications
- SendGrid for transactional emails
- AWS CloudWatch for monitoring

## Data Structures and Interfaces

### Core Entities and Relationships

The system consists of several key entities that interact with each other. The diagram below illustrates the major entities and their relationships:

![Class Diagram](./LocalShop_Connect_class_diagram.mermaid)

### API Interfaces

#### Authentication API

```typescript
interface AuthAPI {
  register(userData: UserRegistrationData): Promise<AuthResponse>;
  login(credentials: LoginCredentials): Promise<AuthResponse>;
  refreshToken(token: string): Promise<AuthResponse>;
  logout(): Promise<void>;
  forgotPassword(email: string): Promise<void>;
  resetPassword(token: string, newPassword: string): Promise<void>;
  verifyEmail(token: string): Promise<void>;
}
```

#### User API

```typescript
interface UserAPI {
  getUserProfile(): Promise<UserProfile>;
  updateUserProfile(data: Partial<UserProfile>): Promise<UserProfile>;
  getAddresses(): Promise<Address[]>;
  addAddress(address: AddressInput): Promise<Address>;
  updateAddress(id: string, address: Partial<AddressInput>): Promise<Address>;
  deleteAddress(id: string): Promise<void>;
  getWishlist(): Promise<Product[]>;
  addToWishlist(productId: string): Promise<void>;
  removeFromWishlist(productId: string): Promise<void>;
}
```

#### Shop API

```typescript
interface ShopAPI {
  registerShop(shopData: ShopRegistrationData): Promise<Shop>;
  getShopProfile(shopId?: string): Promise<Shop>;
  updateShopProfile(data: Partial<ShopProfile>): Promise<Shop>;
  setOperatingHours(hours: OperatingHours[]): Promise<Shop>;
  setDeliverySettings(settings: DeliverySettings): Promise<Shop>;
  getAnalytics(period: string): Promise<ShopAnalytics>;
  getDashboardStats(): Promise<DashboardStats>;
}
```

#### Product API

```typescript
interface ProductAPI {
  getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>>;
  getProductById(id: string): Promise<Product>;
  addProduct(product: ProductInput): Promise<Product>;
  updateProduct(id: string, product: Partial<ProductInput>): Promise<Product>;
  deleteProduct(id: string): Promise<void>;
  bulkUploadProducts(file: File): Promise<BulkUploadResult>;
  searchProducts(query: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>>;
  getProductsByCategory(categoryId: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>>;
  getNearbyProducts(location: GeoLocation, radius: number, filters?: ProductFilters): Promise<PaginatedResponse<Product>>;
}
```

#### Order API

```typescript
interface OrderAPI {
  createOrder(orderData: OrderInput): Promise<Order>;
  getOrderById(id: string): Promise<Order>;
  getOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<Order>;
  cancelOrder(id: string, reason: string): Promise<Order>;
  getShopOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>>;
  acceptOrder(id: string): Promise<Order>;
  rejectOrder(id: string, reason: string): Promise<Order>;
  assignDeliveryPartner(id: string, partnerId: string): Promise<Order>;
}
```

#### Payment API

```typescript
interface PaymentAPI {
  initiatePayment(orderId: string, method: PaymentMethod): Promise<PaymentSession>;
  confirmPayment(sessionId: string): Promise<PaymentResult>;
  getPaymentMethods(): Promise<PaymentMethod[]>;
  refundPayment(paymentId: string, amount?: number): Promise<RefundResult>;
  getTransactionHistory(): Promise<PaginatedResponse<Transaction>>;
}
```

#### Admin API

```typescript
interface AdminAPI {
  // User management
  getUsers(filters?: UserFilters): Promise<PaginatedResponse<User>>;
  updateUserStatus(userId: string, status: UserStatus): Promise<User>;
  
  // Shop management
  getPendingShops(): Promise<PaginatedResponse<Shop>>;
  approveShop(shopId: string): Promise<Shop>;
  rejectShop(shopId: string, reason: string): Promise<Shop>;
  
  // Content management
  getFlaggedContent(): Promise<PaginatedResponse<FlaggedContent>>;
  moderateContent(contentId: string, action: ModerateAction): Promise<void>;
  
  // Platform management
  getPlatformStats(): Promise<PlatformStats>;
  updatePlatformSettings(settings: Partial<PlatformSettings>): Promise<PlatformSettings>;
  
  // Support
  getSupportTickets(filters?: TicketFilters): Promise<PaginatedResponse<SupportTicket>>;
  respondToTicket(ticketId: string, response: string): Promise<SupportTicket>;
}
```

#### Delivery API

```typescript
interface DeliveryAPI {
  getAvailableOrders(): Promise<PaginatedResponse<Order>>;
  acceptDelivery(orderId: string): Promise<Order>;
  updateDeliveryStatus(orderId: string, status: DeliveryStatus): Promise<Order>;
  completeDelivery(orderId: string, proof: DeliveryProof): Promise<Order>;
  getDeliveryHistory(): Promise<PaginatedResponse<Order>>;
  getEarnings(period?: string): Promise<EarningsSummary>;
  optimizeRoute(orderIds: string[]): Promise<OptimizedRoute>;
}
```

#### Notification API

```typescript
interface NotificationAPI {
  getNotifications(): Promise<PaginatedResponse<Notification>>;
  markAsRead(notificationId: string): Promise<void>;
  markAllAsRead(): Promise<void>;
  updateNotificationPreferences(preferences: NotificationPreferences): Promise<NotificationPreferences>;
  subscribeToTopic(topic: string): Promise<void>;
  unsubscribeFromTopic(topic: string): Promise<void>;
}
```

## Program Call Flow

The sequence diagram below illustrates key interactions between different components of the system:

![Sequence Diagram](./LocalShop_Connect_sequence_diagram.mermaid)

## System Architecture

### High-Level Architecture

LocalShop Connect follows a microservices architecture to ensure modularity and scalability. The system is divided into the following components:

1. **Frontend Applications**
   - Customer Web App (Next.js + React)
   - Shopkeeper Dashboard (Next.js + React)
   - Admin Portal (Next.js + React)
   - Delivery Partner Mobile App (React Native - future phase)

2. **API Gateway**
   - Request routing and aggregation
   - Rate limiting and throttling
   - Authentication/Authorization middleware

3. **Microservices**
   - User Service (authentication, profiles)
   - Shop Service (shop management)
   - Product Service (catalog, inventory)
   - Order Service (order processing)
   - Payment Service (payment processing)
   - Delivery Service (delivery management)
   - Notification Service (messaging, alerts)
   - Analytics Service (data aggregation, reports)
   - Admin Service (platform management)

4. **Databases**
   - PostgreSQL Cluster (relational data)
   - MongoDB Cluster (product catalog, geospatial)
   - Redis Cluster (caching, sessions)

5. **External Integrations**
   - Google Maps API
   - Payment Gateways (Stripe/Razorpay)
   - Email Service (SendGrid)
   - Push Notifications (FCM)
   - SMS Gateway (Twilio)

### Deployment Architecture

The system will be deployed on AWS using containerization for consistent development and production environments:

1. **Infrastructure as Code (IaC)**
   - Terraform for provisioning AWS resources
   - Docker for containerization
   - Kubernetes for container orchestration

2. **AWS Resources**
   - EC2 instances for computing
   - RDS for PostgreSQL
   - DocumentDB for MongoDB
   - ElastiCache for Redis
   - S3 for object storage
   - CloudFront for CDN
   - Route 53 for DNS
   - CloudWatch for monitoring

3. **CI/CD Pipeline**
   - GitHub Actions for automated testing and deployment
   - Multiple environments (dev, staging, production)

### Security Considerations

1. **Authentication & Authorization**
   - JWT-based authentication
   - OAuth integration for social logins
   - Role-based access control

2. **Data Security**
   - Encryption in transit (TLS/SSL)
   - Encryption at rest (AWS KMS)
   - PCI-DSS compliance for payment data

3. **API Security**
   - Rate limiting
   - CORS configuration
   - Input validation
   - OWASP Top 10 protection

### Scaling Strategy

1. **Horizontal Scaling**
   - Auto-scaling groups for microservices
   - Read replicas for databases

2. **Performance Optimization**
   - CDN for static assets
   - Redis caching for frequent queries
   - Database query optimization
   - Image optimization and lazy loading

3. **Monitoring & Alerting**
   - Real-time performance monitoring
   - Error tracking and logging
   - Automated alerts for system issues

## Anything UNCLEAR

A few aspects of the system require further clarification:

1. **Delivery Model**: The PRD mentions multiple options (shop's own delivery, platform delivery network, third-party services). A hybrid approach is recommended initially, where shops can use their own delivery or opt into the platform's network. Third-party integration (e.g., with services like DoorDash) could be added in Phase 2.

2. **Payment Split Handling**: We need to define the exact flow for payment splits between the platform, shops, and delivery partners. An escrow system is recommended where the platform holds funds until delivery confirmation, then distributes according to pre-defined commission structures.

3. **Inventory Synchronization**: For shops with existing POS systems, we should develop a set of integration APIs and possibly plugins for popular POS solutions. This would allow bidirectional sync of inventory to prevent overselling.

4. **Offline Capabilities**: The extent of offline functionality needs specification. We recommend implementing a Progressive Web App approach that caches critical data and allows basic browsing in offline mode, with operations queued for when connectivity returns.

5. **Multi-tenancy vs. Multi-instance**: As the platform expands to multiple cities or regions, we need to determine if we'll use a multi-tenant approach (single instance, logically separated data) or multi-instance approach (separate deployments per region).
