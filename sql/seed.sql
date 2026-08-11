-- Seed initial tiers
INSERT INTO tiers (name, price, description, telegram_group_url) VALUES
('Basic Tier', 150000, 'Daily video updates and access to Telegram group', 'https://t.me/lordarky_basic')
ON CONFLICT DO NOTHING;
