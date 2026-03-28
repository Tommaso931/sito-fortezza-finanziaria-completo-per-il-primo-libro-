// netlify/functions/test-supabase.js
const { createClient } = require('@supabase/supabase-js');

exports.handler = async function(event, context) {
  const supabaseUrl  = process.env.SUPABASE_URL;
  const supabaseKey  = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        ok: false, 
        error: 'Variabili d\'ambiente mancanti',
        supabaseUrl: !!supabaseUrl,
        supabaseKey: !!supabaseKey
      })
    };
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    // Query minimale — non serve che la tabella esista
    const { error } = await supabase.from('_test_').select('*').limit(1);
    
    // Un errore "table not found" significa che la connessione FUNZIONA
    const connected = !error || error.code === '42P01' || error.message?.includes('does not exist');

    return {
      statusCode: 200,
      body: JSON.stringify({ 
        ok: connected,
        message: connected ? 'Connessione a Supabase OK ✓' : 'Connessione fallita',
        detail: error?.message || null
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message })
    };
  }
};