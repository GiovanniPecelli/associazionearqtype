/**
 * Automated Database Migration Executor
 * This script reads the migration SQL file and executes it on Supabase
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load .env file
dotenv.config({ path: join(__dirname, '../.env') });

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
    console.error('❌ Missing Supabase credentials in .env file');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    auth: { persistSession: false },
    db: { schema: 'public' }
});

async function executeMigration() {
    console.log('🚀 Starting database migration...\n');

    try {
        // Read the migration SQL file
        const migrationPath = join(__dirname, '../supabase/migrations/00_init_full_schema.sql');
        const migrationSQL = await fs.readFile(migrationPath, 'utf-8');

        console.log('📄 Migration file loaded');
        console.log('📊 Executing SQL...\n');

        // Execute the migration using rpc to raw SQL
        const { data, error } = await supabase.rpc('exec_sql', { sql: migrationSQL });

        if (error) {
            // If exec_sql doesn't exist, try alternative approach
            if (error.code === '42883') {
                console.log('⚠️  exec_sql function not available');
                console.log('📋 Please execute the migration manually:');
                console.log('1. Open Supabase Dashboard → SQL Editor');
                console.log('2. Copy the content from: supabase/migrations/00_init_full_schema.sql');
                console.log('3. Paste and run\n');
                process.exit(1);
            }
            throw error;
        }

        console.log('✅ Migration executed successfully!\n');

        // Verify the changes
        console.log('🔍 Verifying changes...\n');

        // Check documents table
        const { error: docError } = await supabase
            .from('documents')
            .select('only_host')
            .limit(0);

        if (docError) {
            console.log('  ❌ documents.only_host still missing');
        } else {
            console.log('  ✅ documents.only_host column verified');
        }

        // Check profiles table
        const { error: profileError } = await supabase
            .from('profiles')
            .select('bio, skills')
            .limit(0);

        if (profileError) {
            console.log('  ❌ profiles columns still missing');
        } else {
            console.log('  ✅ profiles.bio and profiles.skills columns verified');
        }

        console.log('\n🎉 Database migration complete!');

    } catch (error) {
        console.error('❌ Migration failed:', error.message);
        console.log('\n📋 Manual execution required:');
        console.log('1. Open Supabase Dashboard → SQL Editor');
        console.log('2. Copy the content from: supabase/migrations/fix_all_missing_columns.sql');
        console.log('3. Paste and run');
        process.exit(1);
    }
}

executeMigration();
