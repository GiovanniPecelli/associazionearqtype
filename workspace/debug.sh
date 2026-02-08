#!/bin/bash

echo "🔍 Debugging TheViberz..."
echo ""

# Check if .env exists
if [ -f .env ]; then
    echo "✅ .env file exists"
else
    echo "❌ .env file missing!"
fi

# Check if node_modules exists
if [ -d node_modules ]; then
    echo "✅ node_modules exists"
else
    echo "❌ node_modules missing - run 'npm install'"
fi

# Check if Supabase credentials are set
if grep -q "VITE_SUPABASE_URL" .env && grep -q "VITE_SUPABASE_ANON_KEY" .env; then
    echo "✅ Supabase credentials found in .env"
else
    echo "❌ Supabase credentials missing in .env"
fi

echo ""
echo "📝 To fix white screen issue:"
echo "1. Stop the current dev server (Ctrl+C)"
echo "2. Run: npm install (to ensure all dependencies are installed)"
echo "3. Run: npm run dev"
echo "4. Open http://localhost:5174 in your browser"
echo "5. Open browser console (F12) to see any errors"
echo ""
echo "🔧 If you still see white screen:"
echo "- Check browser console for errors (F12 → Console tab)"
echo "- Make sure you applied the database migration (migration_add_fields.sql)"
echo "- Try clearing browser cache (Ctrl+Shift+R)"
