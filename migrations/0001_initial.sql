-- Migration number: 0001 	 2025-03-13T12:22:00.000Z
-- Multi-tenant Badminton Court Scheduling Application Schema

-- Drop existing tables if they exist
DROP TABLE IF EXISTS counters;
DROP TABLE IF EXISTS access_logs;
DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS wallets;
DROP TABLE IF EXISTS event_participants;
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS court_availability;
DROP TABLE IF EXISTS courts;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS subscription_plans;
DROP TABLE IF EXISTS tenants;

-- Create tables

-- Tenants table (Business entities)
CREATE TABLE tenants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  logo_url TEXT,
  address TEXT,
  phone TEXT,
  email TEXT NOT NULL,
  subscription_plan_id INTEGER,
  status TEXT NOT NULL DEFAULT 'active', -- active, suspended, inactive
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Subscription plans for tenants
CREATE TABLE subscription_plans (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  description TEXT,
  price REAL NOT NULL,
  billing_cycle TEXT NOT NULL, -- monthly, yearly
  max_courts INTEGER NOT NULL,
  max_bookings_per_month INTEGER,
  features TEXT, -- JSON string of features
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Users table (All user types)
CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER, -- NULL for normal users and admins
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  profile_image_url TEXT,
  role TEXT NOT NULL, -- business_owner, normal_user, event_organizer, admin
  status TEXT NOT NULL DEFAULT 'active', -- active, suspended, inactive
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE SET NULL
);

-- Courts table
CREATE TABLE courts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tenant_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  court_type TEXT NOT NULL, -- singles, doubles, mixed
  features TEXT, -- JSON string of features/amenities
  image_url TEXT,
  status TEXT NOT NULL DEFAULT 'active', -- active, maintenance, inactive
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE
);

-- Court availability
CREATE TABLE court_availability (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  court_id INTEGER NOT NULL,
  day_of_week INTEGER, -- 0-6 for recurring schedules (NULL for specific dates)
  specific_date TEXT, -- YYYY-MM-DD format (NULL for recurring schedules)
  start_time TEXT NOT NULL, -- HH:MM format
  end_time TEXT NOT NULL, -- HH:MM format
  price_per_hour REAL NOT NULL,
  is_peak BOOLEAN NOT NULL DEFAULT 0,
  is_recurring BOOLEAN NOT NULL DEFAULT 1,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE
);

-- Bookings table
CREATE TABLE bookings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  court_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  event_id INTEGER, -- NULL for regular bookings
  start_datetime TEXT NOT NULL, -- YYYY-MM-DD HH:MM format
  end_datetime TEXT NOT NULL, -- YYYY-MM-DD HH:MM format
  total_price REAL NOT NULL,
  status TEXT NOT NULL DEFAULT 'confirmed', -- pending, confirmed, cancelled, completed
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, refunded
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (court_id) REFERENCES courts(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE SET NULL
);

-- Events table
CREATE TABLE events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  organizer_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  max_participants INTEGER NOT NULL,
  is_public BOOLEAN NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'active', -- active, cancelled, completed
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (organizer_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Event participants
CREATE TABLE event_participants (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  event_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'invited', -- invited, confirmed, declined, waitlisted
  payment_status TEXT NOT NULL DEFAULT 'pending', -- pending, paid, refunded
  amount_due REAL NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Wallets table
CREATE TABLE wallets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL UNIQUE,
  balance REAL NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'USD',
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Transactions table
CREATE TABLE transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  wallet_id INTEGER NOT NULL,
  amount REAL NOT NULL,
  type TEXT NOT NULL, -- deposit, withdrawal, transfer, payment, refund
  status TEXT NOT NULL DEFAULT 'completed', -- pending, completed, failed
  related_entity_id INTEGER, -- booking_id, event_id, etc.
  related_entity_type TEXT, -- booking, event, etc.
  description TEXT,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (wallet_id) REFERENCES wallets(id) ON DELETE CASCADE
);

-- Messages table
CREATE TABLE messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sender_id INTEGER NOT NULL,
  receiver_id INTEGER, -- NULL for group chats
  event_id INTEGER, -- NULL for direct messages
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
);

-- Create indexes for performance
CREATE INDEX idx_tenants_subscription_plan_id ON tenants(subscription_plan_id);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_courts_tenant_id ON courts(tenant_id);
CREATE INDEX idx_court_availability_court_id ON court_availability(court_id);
CREATE INDEX idx_bookings_court_id ON bookings(court_id);
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_event_id ON bookings(event_id);
CREATE INDEX idx_events_organizer_id ON events(organizer_id);
CREATE INDEX idx_event_participants_event_id ON event_participants(event_id);
CREATE INDEX idx_event_participants_user_id ON event_participants(user_id);
CREATE INDEX idx_wallets_user_id ON wallets(user_id);
CREATE INDEX idx_transactions_wallet_id ON transactions(wallet_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX idx_messages_event_id ON messages(event_id);

-- Insert initial data for testing
INSERT INTO subscription_plans (name, description, price, billing_cycle, max_courts, max_bookings_per_month, features) VALUES 
  ('Basic', 'Basic plan for small businesses', 29.99, 'monthly', 3, 100, '{"chat": true, "analytics": false, "customization": false}'),
  ('Pro', 'Professional plan for medium businesses', 79.99, 'monthly', 10, 500, '{"chat": true, "analytics": true, "customization": false}'),
  ('Enterprise', 'Enterprise plan for large businesses', 199.99, 'monthly', 50, 2000, '{"chat": true, "analytics": true, "customization": true}');

-- Insert a test tenant
INSERT INTO tenants (name, description, email, subscription_plan_id, status) VALUES 
  ('Demo Badminton Club', 'A demo badminton club for testing', 'demo@example.com', 2, 'active');

-- Insert a test admin user
INSERT INTO users (email, password_hash, first_name, last_name, role, status) VALUES 
  ('admin@example.com', '$2a$12$1234567890123456789012uGfLANLvzCOj9CpzJ9AfhF0379jyoti', 'Admin', 'User', 'admin', 'active');

-- Insert a test business owner
INSERT INTO users (tenant_id, email, password_hash, first_name, last_name, role, status) VALUES 
  (1, 'owner@example.com', '$2a$12$1234567890123456789012uGfLANLvzCOj9CpzJ9AfhF0379jyoti', 'Business', 'Owner', 'business_owner', 'active');

-- Insert test normal users
INSERT INTO users (email, password_hash, first_name, last_name, role, status) VALUES 
  ('user1@example.com', '$2a$12$1234567890123456789012uGfLANLvzCOj9CpzJ9AfhF0379jyoti', 'Normal', 'User1', 'normal_user', 'active'),
  ('user2@example.com', '$2a$12$1234567890123456789012uGfLANLvzCOj9CpzJ9AfhF0379jyoti', 'Normal', 'User2', 'normal_user', 'active');

-- Insert a test event organizer
INSERT INTO users (email, password_hash, first_name, last_name, role, status) VALUES 
  ('organizer@example.com', '$2a$12$1234567890123456789012uGfLANLvzCOj9CpzJ9AfhF0379jyoti', 'Event', 'Organizer', 'event_organizer', 'active');

-- Insert test courts
INSERT INTO courts (tenant_id, name, description, court_type, features, status) VALUES 
  (1, 'Court A', 'Professional singles court', 'singles', '{"lighting": "LED", "flooring": "wooden", "shuttlecock_service": true}', 'active'),
  (1, 'Court B', 'Professional doubles court', 'doubles', '{"lighting": "LED", "flooring": "synthetic", "shuttlecock_service": true}', 'active'),
  (1, 'Court C', 'Mixed court for all games', 'mixed', '{"lighting": "standard", "flooring": "wooden", "shuttlecock_service": false}', 'active');

-- Insert test court availability
INSERT INTO court_availability (court_id, day_of_week, start_time, end_time, price_per_hour, is_peak, is_recurring) VALUES 
  (1, 1, '08:00', '12:00', 15.00, 0, 1), -- Monday morning
  (1, 1, '12:00', '20:00', 25.00, 1, 1), -- Monday afternoon/evening (peak)
  (2, 2, '08:00', '12:00', 15.00, 0, 1), -- Tuesday morning
  (2, 2, '12:00', '20:00', 25.00, 1, 1), -- Tuesday afternoon/evening (peak)
  (3, 3, '08:00', '12:00', 15.00, 0, 1), -- Wednesday morning
  (3, 3, '12:00', '20:00', 25.00, 1, 1); -- Wednesday afternoon/evening (peak)

-- Create wallets for users
INSERT INTO wallets (user_id, balance, currency) VALUES 
  (3, 100.00, 'USD'),
  (4, 75.50, 'USD'),
  (5, 200.00, 'USD');
