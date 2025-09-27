const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zlijlmrrqfpzexbbdazc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsaWpsbXJycWZwemV4YmJkYXpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQzNDgzMCwiZXhwIjoyMDc0MDEwODMwfQ.4Wjqrthhr7AUi-nz8rORgfE7v4RY09ggSyfP2dUrJIY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testUpdateAudit() {
  console.log('🔍 Test de mise à jour du statut d\'audit...\n');
  
  try {
    // Test de mise à jour du statut
    const { data, error } = await supabase
      .from('demandes_audit')
      .update({
        statut: 'contacte',
        updated_at: new Date().toISOString()
      })
      .eq('id', 'ec90ed3e-9cdf-4b05-9f5e-6a2c0fb31333')
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur mise à jour:', error);
    } else {
      console.log('✅ Mise à jour réussie !');
      console.log('Nouveau statut:', data.statut);
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testUpdateAudit();
