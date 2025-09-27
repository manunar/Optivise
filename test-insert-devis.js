const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zlijlmrrqfpzexbbdazc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsaWpsbXJycWZwemV4YmJkYXpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQzNDgzMCwiZXhwIjoyMDc0MDEwODMwfQ.4Wjqrthhr7AUi-nz8rORgfE7v4RY09ggSyfP2dUrJIY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testInsertDevis() {
  console.log('🔍 Test d\'insertion dans demandes_devis...\n');
  
  try {
    // Test d'insertion minimale pour voir quels champs sont requis
    const { data, error } = await supabase
      .from('demandes_devis')
      .insert({
        nom: 'Test Audit',
        entreprise: 'Test Company',
        statut: 'nouveau'
      })
      .select()
      .single();

    if (error) {
      console.error('❌ Erreur insertion:', error);
    } else {
      console.log('✅ Insertion réussie:', data.id);
      console.log('Données:', JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testInsertDevis();
