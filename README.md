Food Delivery Web Application
A full-stack food delivery web application developed as a CSE-499A web application project. The repository is divided into three independent applications:
- Frontend — customer-facing website for browsing food, managing a cart, and placing orders.
- Admin panel — dashboard for adding/removing food items and managing order status.
- Backend API — REST API for authentication, food catalogue, cart operations, orders, image uploads, and payment checkout.
Project status: This README documents the features and technologies found in the supplied source code. Payment, database, and deployment configuration must be completed with your own environment variables before running the application.

Contents
- Features
- Technology stack
- Application architecture
- Project structure
- How the application works
- Requirements
- Installation and setup
- Environment variables
- API overview
- Data models
- Security and deployment notes
- Possible future improvements
Features
Customer website
- Browse the food catalogue and explore food categories.
- View food details and prices.
- Add items to the cart, increase quantities, and remove items.
- Register an account and log in.
- Keep cart data associated with the signed-in user.
- Enter delivery/contact details during checkout.
- Place an order using Cash on Delivery (COD) or Stripe Checkout.
- View a user's order history and order status.
- Display toast notifications for important actions.
- Responsive page styling using CSS.
Admin panel
- Add food items with a name, description, price, category, and image.
- View the available food catalogue.
- Remove food items.
- View customer orders, delivery details, order totals, and item quantities.
- Update an order's status, including Food Processing, Out for delivery, and Delivered.
Backend
- REST endpoints built with Express.
- MongoDB persistence through Mongoose.
- User registration and login.
- Password hashing with bcrypt.
- JSON Web Token (JWT) authentication middleware for protected customer/cart/order operations.
- Food image upload and static image serving.
- Cart persistence in the user record.
- Order creation, order history, and status updates.
- Stripe Checkout session creation and payment-result handling.
- CORS and JSON request-body middleware.
Technology stack
Area	Technologies	Purpose
Customer frontend	React 18, JavaScript, Vite	Interactive customer interface and development/build tooling
Routing	React Router DOM	Client-side navigation between pages
HTTP requests	Axios	Calls to the backend REST API
Notifications	React Toastify	Success/error toast messages
Styling	CSS	Layout and component styling
Admin frontend	React 18, JavaScript, Vite	Admin dashboard interface
Backend	Node.js, Express 4	REST API and application server
Database	MongoDB, Mongoose 8	Persistent users, food items, carts, and orders
Authentication	JSON Web Token (jsonwebtoken)	Signed tokens used by authentication middleware
Password security	bcrypt	Hashing and checking user passwords
Validation	validator	Email validation and related input checks
Image upload	multer	Accepts and stores uploaded food images
Payments	Stripe Node SDK and @stripe/stripe-js	Stripe Checkout integration
Configuration	dotenv	Reads server configuration from environment variables
Middleware/utilities	cors, body-parser	Cross-origin access and request parsing support
Code quality	ESLint and React ESLint plugins	Static code checks


Application architecture
Customer browser
      |
      v
React + Vite frontend (default port 5173)
      |
      | HTTP requests using Axios
      v
Express REST API (default port 4000)
      |                 |
      v                 v
MongoDB             Local uploads/ directory
(Mongoose)          (food images)
      |
      v
Stripe Checkout (external payment service, when configured)

Admin browser
      |
      v
React + Vite admin panel
      |
      | HTTP requests using Axios
      v
Express REST API
The customer frontend and admin panel are separate React applications. Both communicate with the backend API. The backend uses MongoDB for application records and serves uploaded food images from /images.
Project structure
CSE-499A Web-Application/
├── frontend/                  # Customer-facing React application
│   ├── src/
│   │   ├── components/        # Navbar, footer, food cards, menus, login popup
│   │   ├── pages/             # Home, Cart, PlaceOrder, MyOrders, Verify
│   │   ├── Context/           # Shared store, cart, token and API state
│   │   └── assets/            # Food images, icons and static assets
│   ├── package.json
│   └── vite.config.js
├── admin/                     # React admin dashboard
│   ├── src/
│   │   ├── components/        # Navbar and sidebar
│   │   ├── pages/             # Add, List and Orders
│   │   └── assets/            # Dashboard icons and images
│   ├── package.json
│   └── vite.config.js
└── backend/                   # Express API
    ├── config/db.js           # MongoDB connection
    ├── controllers/           # User, food, cart and order logic
    ├── middleware/auth.js     # JWT authentication
    ├── models/                # Mongoose schemas
    ├── routes/                # API route definitions
    ├── uploads/               # Created/used for uploaded food images
    ├── server.js              # API entry point
    └── package.json
How the application works
1. Browse food: the customer frontend requests food items from GET /api/food/list.
2. Manage the cart: item quantities are maintained in shared React context. When a customer is signed in, cart changes are sent to the API and stored with the user's record.
3. Create an account or sign in: the API validates registration inputs, hashes passwords, and returns a JWT after registration/login.
4. Place an order: the frontend submits the delivery address and selected items. The backend creates an order and clears the saved cart.
5. Pay: the customer can choose COD or Stripe Checkout. Stripe requires a valid secret key and correct success/cancel URLs.
6. Track orders: the customer can view their orders. The admin panel can view orders and change their status.
Requirements
Install the following before starting:
- Node.js (a current LTS release is recommended)
- npm (included with Node.js)
- A MongoDB database, either local or hosted
- A Stripe account and test API keys if testing card payments
Installation and setup
Run commands from the project root, CSE-499A Web-Application/. Open a separate terminal for each application.
1. Configure the backend
cd backend
npm install
Create or update backend/.env with your own values:
PORT=4000
MONGODB_URI=mongodb://127.0.0.1:27017/food-delivery
JWT_SECRET=replace_with_a_long_random_secret
STRIPE_SECRET_KEY=sk_test_replace_with_your_stripe_test_key
Use the MongoDB URI appropriate for your database. Do not commit real secrets to version control.
Start the API:
npm run server
The backend uses port 4000 by default. Opening http://localhost:4000/ should return API Working if the server starts successfully.
2. Start the customer frontend
In a new terminal:
cd frontend
npm install
npm run dev
Vite normally serves the customer site at http://localhost:5173.
The API base URL is currently set to http://localhost:4000 in frontend/src/Context/StoreContext.jsx. Update this for a different backend host or production deployment.
3. Start the admin panel
In another terminal:
cd admin
npm install
npm run dev
Vite will print the local admin URL in the terminal (commonly http://localhost:5174 if port 5173 is already occupied). The admin API URL is set in admin/src/assets/assets.js; update it if your backend runs elsewhere.
4. Build for production
From either frontend/ or admin/:
npm run build
To preview the generated build locally:
npm run preview
The backend can be started with Node in a production process manager after its environment variables and deployment settings are configured.
Environment variables
Variable	Required for	Description
PORT	Backend	API port; defaults to 4000
MONGODB_URI	Backend	MongoDB connection URI
JWT_SECRET	Registration/login and protected routes	Secret used to sign and verify JWTs
STRIPE_SECRET_KEY	Stripe payment	Stripe secret API key


The supplied source also has a local frontend URL hard-coded in the order controller for Stripe success/cancel redirects (http://localhost:5173). Change it to the deployed customer frontend URL for production. Never put STRIPE_SECRET_KEY or JWT_SECRET in frontend code.
API overview
All routes below are mounted on the backend server at http://localhost:4000. Protected routes expect the JWT in the token request header.
Method	Endpoint	Purpose	Authentication in current code
GET	/	API health response (API Working)	No
POST	/api/user/register	Register a user	No
POST	/api/user/login	Log in	No
GET	/api/food/list	List food items	No
POST	/api/food/add	Add a food item with an image upload	No
POST	/api/food/remove	Remove a food item	No
POST	/api/cart/get	Get the signed-in user's cart	Yes
POST	/api/cart/add	Add one unit of an item to the cart	Yes
POST	/api/cart/remove	Remove one unit of an item from the cart	Yes
POST	/api/order/place	Create an order and Stripe Checkout session	Yes
POST	/api/order/placecod	Place a COD order	Yes
POST	/api/order/userorders	Get the signed-in user's orders	Yes
POST	/api/order/verify	Process the Stripe return result	No in current route configuration
GET	/api/order/list	List all orders for the admin interface	No in current route configuration
POST	/api/order/status	Update an order's status	No in current route configuration


Important: The table reflects the supplied route configuration, not a recommendation for production. The current code does not protect the admin food-management and order-management endpoints with an admin login/role check. Secure these routes before exposing the application publicly.
Data models
User
- name — user's name
- email — unique email address
- password — bcrypt-hashed password
- cartData — saved cart quantities
Food
- name — food name
- description — food description
- price — numeric price
- image — uploaded image filename
- category — food category
Order
- userId — associated user's ID
- items — ordered food items and quantities
- amount — order total
- address — delivery information
- status — order progress (defaults to Food Processing)
- date — order creation date
- payment — payment state
Security and deployment notes
Before using this as a public production service:
- Add real admin authentication and authorization to food add/remove, order list, and order status endpoints.
- Verify Stripe payments server-side using Stripe webhooks or a verified Checkout Session. Do not rely only on a client-provided success query parameter.
- Validate and sanitize all API inputs, enforce upload file size/type limits, and handle missing files/records safely.
- Use HTTPS and production environment variables; never publish .env files or API secrets.
- Configure CORS to allow only the required frontend/admin origins.
- Review order pricing on the server rather than trusting item prices and totals sent by the browser.
- Store uploaded files in durable object storage if deploying to an environment with an ephemeral filesystem.
- Replace hard-coded localhost URLs with environment-based configuration.
- Add automated tests, structured logging, and appropriate error responses.
Possible future improvements
- Admin login with role-based permissions.
- Search, filtering, sorting, and pagination for food and orders.
- Food editing and inventory/availability management.
- More robust payment verification and payment-failure recovery.
- Order email/SMS notifications.
- Automated tests and CI checks.
- Deployment configuration and a documented production environment.
License
No project-specific license was identified in the supplied source archive. Add a LICENSE file if you intend to distribute the project publicly.
