
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'

dotenv.config()

const url = process.env.VITE_SUPABASE_URL
const key = process.env.VITE_SUPABASE_ANON_KEY

console.log('--- SUPABASE CONFIG ---')
console.log('URL:', url)
console.log('Key:', key ? (key.substring(0, 5) + '...' + key.substring(key.length - 5)) : 'MISSING')

if (!url || !key) {
    console.error('MISSING VARIABLES')
    process.exit(1)
}

async function test() {
    console.log('\n--- TESTING CONNECTION ---')
    try {
        // Method 1: Direct Fetch
        const fetchUrl = `${url}/rest/v1/?apikey=${key}`
        console.log('Fetching Root:', fetchUrl.replace(key, 'REDACTED'))
        const res = await fetch(fetchUrl)
        console.log('Root Status:', res.status)
        if (!res.ok) console.log('Root Body:', await res.text())

        // Method 2: Profiles
        // NOTE: If tables don't exist this will fail, but connection should be ok.
        const supabase = createClient(url, key)
        const { data, error } = await supabase.from('channels').select('count', { count: 'exact', head: true })

        console.log('\n--- CLIENT TEST (Channels) ---')
        if (error) {
            console.error('Supabase Error:', error)
        } else {
            console.log('Success! Connection valid.')
        }

    } catch (e) {
        console.error('EXCEPTION:', e)
    }
}

test()
