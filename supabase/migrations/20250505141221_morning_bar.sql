/*
  # Add outfit count to accounts

  1. Changes
    - Add `outfit_count` column to accounts table with integer default 0
*/

ALTER TABLE accounts ADD COLUMN IF NOT EXISTS outfit_count integer DEFAULT 0;