import { supabase } from './src/lib/supabase.js'

console.log('Testing Supabase connection...')

// Test 1: Check auth
const testAuth = async () => {
    console.log('\n1️⃣ Testing auth.getSession()...')
    try {
        const { data, error } = await supabase.auth.getSession()
        if (error) {
            console.error('❌ Auth error:', error)
        } else {
            console.log('✅ Session:', data.session ? 'Active' : 'None')
            if (data.session) {
                console.log('   User:', data.session.user.email)
                return data.session.user.id
            }
        }
    } catch (e) {
        console.error('❌ Exception:', e)
    }
    return null
}

// Test 2: Check database connection
const testDatabase = async (userId) => {
    console.log('\n2️⃣ Testing database query...')
    if (!userId) {
        console.log('⚠️ No user ID, skipping')
        return
    }

    try {
        console.log('Querying profiles table for user:', userId)
        const { data, error } = await supabase
            .from('profiles')
            .select('role, is_approved, display_name')
            .eq('id', userId)
            .single()

        if (error) {
            console.error('❌ Database error:', error)
            console.error('   Code:', error.code)
            console.error('   Message:', error.message)
        } else {
            console.log('✅ Profile data:', data)
        }
    } catch (e) {
        console.error('❌ Exception:', e)
    }
}

// Run tests
const runTests = async () => {
    const userId = await testAuth()
    await testDatabase(userId)
    console.log('\n✅ Tests complete')
    process.exit(0)
}

runTests()
