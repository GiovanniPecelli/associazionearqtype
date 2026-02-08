import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY

console.log('Testing Supabase Connection...')
console.log('URL:', supabaseUrl)
console.log('Key length:', supabaseAnonKey ? supabaseAnonKey.length : 0)

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function test() {
    try {
        const url = `${supabaseUrl}/rest/v1/profiles?select=*&head=true`
        console.log('Fetching:', url)

        const response = await fetch(url, {
            headers: {
                'apikey': supabaseAnonKey,
                'Authorization': `Bearer ${supabaseAnonKey}`
            }
        })

        console.log('Status:', response.status)
        console.log('Status Text:', response.statusText)

        if (!response.ok) {
            const text = await response.text()
            console.log('Body:', text)
        } else {
            console.log('✅ Connection successful!')
        }
    } catch (err) {
        console.error('❌ Network error:', err)
    }
}

test()
