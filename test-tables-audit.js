const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zlijlmrrqfpzexbbdazc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsaWpsbXJycWZwemV4YmJkYXpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQzNDgzMCwiZXhwIjoyMDc0MDEwODMwfQ.4Wjqrthhr7AUi-nz8rORgfE7v4RY09ggSyfP2dUrJIY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testTables() {
  console.log('🔍 Test des tables d\'audit...\n');
  
  try {
    // Test table demandes_audit
    console.log('📋 Table demandes_audit:');
    const { data: auditData, error: auditError } = await supabase
      .from('demandes_audit')
      .select('*')
      .limit(5);
    
    if (auditError) {
      console.error('❌ Erreur demandes_audit:', auditError.message);
    } else {
      console.log(`✅ ${auditData.length} demandes d'audit trouvées`);
      if (auditData.length > 0) {
        console.log('Exemple:', JSON.stringify(auditData[0], null, 2));
      }
    }
    
    console.log('\n📋 Table demandes_devis:');
    const { data: devisData, error: devisError } = await supabase
      .from('demandes_devis')
      .select('*')
      .limit(5);
    
    if (devisError) {
      console.error('❌ Erreur demandes_devis:', devisError.message);
    } else {
      console.log(`✅ ${devisData.length} demandes de devis trouvées`);
      if (devisData.length > 0) {
        console.log('Exemple:', JSON.stringify(devisData[0], null, 2));
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testTables();
