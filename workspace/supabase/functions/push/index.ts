import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import webpush from "https://esm.sh/web-push@3.6.3"
// Use firebase-admin via npm compatibility
import admin from "npm:firebase-admin@12.0.0"

console.log("Push Notification Function Started (HTTP v1)")

// Initialize Firebase Admin (Singleton pattern)
// We expect the Service Account JSON details in Environment Variables
if (admin.apps.length === 0) {
    try {
        const projectId = Deno.env.get('FIREBASE_PROJECT_ID')
        const clientEmail = Deno.env.get('FIREBASE_CLIENT_EMAIL')
        // Private key might contain newlines which need to be handled
        const privateKey = Deno.env.get('FIREBASE_PRIVATE_KEY')?.replace(/\\n/g, '\n')

        if (projectId && clientEmail && privateKey) {
            admin.initializeApp({
                credential: admin.credential.cert({
                    projectId,
                    clientEmail,
                    privateKey,
                }),
            })
            console.log("Firebase Admin Initialized")
        } else {
            console.warn("Missing FIREBASE_ credentials. Native push will fail.")
        }
    } catch (e) {
        console.error("Firebase Init Error:", e)
    }
}

serve(async (req) => {
    try {
        const { record } = await req.json()

        // 1. Validate Payload
        if (!record || !record.content || !record.channel) {
            return new Response(JSON.stringify({ message: "Invalid payload" }), { headers: { "Content-Type": "application/json" } })
        }

        // 2. Setup Database Client
        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        )

        // 3. Setup VAPID (Web Push)
        const vapidSubject = Deno.env.get('VAPID_SUBJECT') || 'mailto:admin@example.com'
        const vapidPublicKey = Deno.env.get('VAPID_PUBLIC_KEY')
        const vapidPrivateKey = Deno.env.get('VAPID_PRIVATE_KEY')

        if (vapidPublicKey && vapidPrivateKey) {
            webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)
        }

        console.log(`Processing message from user ${record.user_id} in channel ${record.channel}`)

        // 4. Get all subscribers (excluding the sender)
        const { data: subscriptions, error: subError } = await supabaseClient
            .from('push_subscriptions')
            .select('*')
            .neq('user_id', record.user_id)

        if (subError) { throw subError }
        if (!subscriptions || subscriptions.length === 0) {
            return new Response(JSON.stringify({ message: "No subscribers" }), { headers: { "Content-Type": "application/json" } })
        }

        console.log(`Found ${subscriptions.length} subscriptions to notify`)

        // 5. Send Notifications
        const promises = subscriptions.map(async (sub) => {

            // --- NATIVE PUSH (FCM V1) ---
            if (sub.auth === 'native') {
                if (admin.apps.length === 0) {
                    console.error("Skipping Native Push: Firebase not initialized")
                    return
                }

                try {
                    // Send using Firebase Admin SDK (HTTP v1)
                    await admin.messaging().send({
                        token: sub.endpoint, // The FCM Token
                        notification: {
                            title: `New in #${record.channel}`,
                            body: record.content.substring(0, 100),
                        },
                        data: {
                            channel: record.channel,
                            url: `/chat?channel=${record.channel}` // handled by app
                        },
                        android: {
                            notification: {
                                sound: 'default',
                                clickAction: 'FCM_PLUGIN_ACTIVITY'
                            }
                        },
                        apns: {
                            payload: {
                                aps: {
                                    sound: 'default'
                                }
                            }
                        }
                    })
                } catch (e) {
                    console.error("FCM Send Error", e)
                    // Check for invalid token errors (code: messaging/registration-token-not-registered)
                    if (e.code === 'messaging/registration-token-not-registered' || e.message?.includes('Unregistered')) {
                        console.log(`Deleting dead native subscription: ${sub.id}`)
                        await supabaseClient.from('push_subscriptions').delete().eq('id', sub.id)
                    }
                }
                return
            }

            // --- WEB PUSH (VAPID) ---
            if (!vapidPublicKey || !vapidPrivateKey) return;

            const pushSubscription = {
                endpoint: sub.endpoint,
                keys: {
                    p256dh: sub.p256dh,
                    auth: sub.auth
                }
            }

            const notificationPayload = JSON.stringify({
                title: `New in #${record.channel}`,
                body: record.content.substring(0, 100),
                url: `/chat?channel=${record.channel}`,
                channel: record.channel
            })

            return webpush.sendNotification(pushSubscription, notificationPayload)
                .catch(async (err) => {
                    if (err.statusCode === 410 || err.statusCode === 404) {
                        console.log(`Deleting dead web subscription: ${sub.id}`)
                        await supabaseClient.from('push_subscriptions').delete().eq('id', sub.id)
                    } else {
                        console.error("Web Push Error", err)
                    }
                })
        })

        await Promise.all(promises)

        return new Response(JSON.stringify({ success: true, count: subscriptions.length }), {
            headers: { "Content-Type": "application/json" },
        })

    } catch (error) {
        console.error("Function Error", error)
        return new Response(JSON.stringify({ error: error.message }), { status: 400, headers: { "Content-Type": "application/json" } })
    }
})
