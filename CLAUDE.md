# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Context

Learning project following Maximilian Schwarzmüller's "Node.js – The Complete Guide" course: a small shop app (products, cart, orders) built with Express + EJS. The codebase evolves chapter by chapter, so older approaches are often left **commented out** next to the current ones (e.g. the native-MongoDB-driver versions of the models at the bottom of [models/product.js](models/product.js) and [models/user.js](models/user.js)). Treat commented-out code as course history, not dead code to delete, unless asked.

## Commands

- `npm start` — run with nodemon (auto-reload)
- `npm run start-server` — run with plain node
- App listens on http://localhost:3000

There are no tests. An ESLint config exists as `eslintrc.json` (no leading dot, so ESLint won't auto-detect it) and ESLint isn't installed as a dependency.

## Architecture

- **MVC**: `routes/` → `controllers/` → `models/`, rendering EJS views from `views/` (`views/includes/` holds the shared head/navigation/end partials). Static files are served from `public/`.
- **Data layer: Mongoose** against MongoDB Atlas (`shop` database). The connection string is built in [app.js](app.js) from `DB_PASSWORD` in `.env` (loaded by `dotenv`). The server only starts listening after `mongoose.connect` succeeds.
  - [util/database.js](util/database.js) (`mongoConnect`/`getDb`, native `mongodb` driver) belongs to the previous course section and is no longer used by the live code.
  - `data/*.json` holds data from the even earlier file-based storage section, and is also unused.
  - `mysql2`/`sequelize`, `pug` and `express-handlebars` in package.json are left over from earlier sections too. Only EJS is the active view engine.
- **Fake auth**: a middleware in [app.js](app.js) loads a hardcoded user by ObjectId on every request and attaches it as `req.session.user` (a full Mongoose document, so methods like `req.session.user.addToCart(product)` work). On startup, a default user is created if the users collection is empty. If the DB is reset, the hardcoded ID in that middleware must be updated to match the new user.
- **Models**: `Product` has a `userId` ref to `User`. `User` embeds `cart.items[]` (`{ productId, quantity }`) and defines instance methods via `userSchema.methods`.
- **Work in progress**: in [routes/shop.js](routes/shop.js), the cart view, cart item deletion and order routes are commented out while they're being migrated to Mongoose.

## Conventions

- Controllers use promise chains (`.then/.catch`), and errors are only `console.log`ged.
- Every `res.render` passes `pageTitle` and `path`. The navigation partial uses `path` to highlight the active link.
- `.ejsbrc.json`: EJS formatting uses 4-space indentation.
