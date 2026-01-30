import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

let supabase;

if (supabaseUrl && supabaseUrl !== 'YOUR_SUPABASE_URL' && supabaseAnonKey) {
    supabase = createClient(supabaseUrl, supabaseAnonKey);
} else {
    console.warn("Supabase credentials not found. Using Mock Mode.");

    // Mock Implementation for Demo purposes
    const mockProducts = [
        { id: 1, name: 'Sample Product', sku: 'SMP-001', category: 'General', price: 19.99, quantity: 50 },
        { id: 2, name: 'Demo Item', sku: 'DMO-002', category: 'General', price: 29.99, quantity: 20 },
    ];

    supabase = {
        from: (table) => {
            if (table === 'products') {
                return {
                    select: () => Promise.resolve({ data: mockProducts, error: null }),
                    insert: (data) => {
                        const newProduct = { ...data[0], id: Math.random() };
                        mockProducts.push(newProduct);
                        return Promise.resolve({ data: [newProduct], error: null });
                    },
                    update: (data) => ({
                        eq: (id) => Promise.resolve({ data: [], error: null }) // Mock update
                    }),
                    delete: () => ({
                        eq: (id) => Promise.resolve({ data: [], error: null }) // Mock delete
                    })
                };
            }
            return {
                select: () => Promise.resolve({ data: [], error: null })
            };
        },
        auth: {
            signUp: ({ email, password }) => Promise.resolve({ data: { user: { email } }, error: null }),
            signInWithPassword: ({ email, password }) => Promise.resolve({ data: { user: { email } }, error: null }),
            signOut: () => Promise.resolve({ error: null }),
            onAuthStateChange: (callback) => {
                // Return generic unsubscribe
                return { data: { subscription: { unsubscribe: () => { } } } };
            }
        }
    };
}

export { supabase };
