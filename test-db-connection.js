const { createClient } = require('@supabase/supabase-js');

// Variables d'environnement - remplacez par vos vraies valeurs
const supabaseUrl = 'https://zlijlmrrqfpzexbbdazc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsaWpsbXJycWZwemV4YmJkYXpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQzNDgzMCwiZXhwIjoyMDc0MDEwODMwfQ.4Wjqrthhr7AUi-nz8rORgfE7v4RY09ggSyfP2dUrJIY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testConnection() {
  console.log('🔍 Test de connexion Supabase...\n');
  
  try {
    // Test 1: Vérifier les options catalogue
    console.log('📋 Contenu de options_catalogue:');
    const { data: options, error: optionsError } = await supabase
      .from('options_catalogue')
      .select('*')
      .limit(5);
    
    if (optionsError) {
      console.error('❌ Erreur options_catalogue:', optionsError);
    } else {
      console.log(`✅ ${options.length} options trouvées`);
      if (options.length > 0) {
        console.log('Exemple:', options[0]);
      }
    }
    
    console.log('\n📋 Contenu de demandes_devis:');
    const { data: demandes, error: demandesError } = await supabase
      .from('demandes_devis')
      .select('*')
      .limit(3);
    
    if (demandesError) {
      console.error('❌ Erreur demandes_devis:', demandesError);
    } else {
      console.log(`✅ ${demandes.length} demandes trouvées`);
    }
    
    console.log('\n📋 Contenu de portfolio_simple:');
    const { data: portfolio, error: portfolioError } = await supabase
      .from('portfolio_simple')
      .select('*')
      .limit(3);
    
    if (portfolioError) {
      console.error('❌ Erreur portfolio_simple:', portfolioError);
    } else {
      console.log(`✅ ${portfolio.length} projets portfolio trouvés`);
      if (portfolio.length > 0) {
        console.log('Exemple:', portfolio[0]);
      }
    }
    
  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testConnection();