-- Add is_delete column to sessions table
ALTER TABLE sessions ADD COLUMN IF NOT EXISTS is_delete BOOLEAN DEFAULT FALSE;

-- Add is_delete column to places table
ALTER TABLE places ADD COLUMN IF NOT EXISTS is_delete BOOLEAN DEFAULT FALSE; 