const { createClient } = require('@supabase/supabase-js');

// Variables d'environnement - remplacez par vos vraies valeurs
const supabaseUrl = 'https://zlijlmrrqfpzexbbdazc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpsaWpsbXJycWZwemV4YmJkYXpjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1ODQzNDgzMCwiZXhwIjoyMDc0MDEwODMwfQ.4Wjqrthhr7AUi-nz8rORgfE7v4RY09ggSyfP2dUrJIY';

const supabase = createClient(supabaseUrl, supabaseKey);

async function testApiQuery() {
  console.log('🔍 Test de la requête API exacte...\n');
  
  try {
    // Test exact de la requête de l'API
    const { data: requests, error } = await supabase
      .from('demandes_audit')
      .select(`
        id,
        email,
        nom,
        prenom,
        entreprise,
        telephone,
        url_site_actuel,
        problemes_identifies,
        objectifs_souhaites,
        taille_site_estimee,
        budget_envisage,
        delai_souhaite,
        message_auto_genere,
        commentaires_libres,
        statut,
        priorite,
        assignee_id,
        created_at,
        updated_at,
        date_audit_prevue,
        rapport_audit_url,
        recommandations,
        devis_genere_id
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('❌ Erreur Supabase:', error);
      return;
    }

    console.log(`✅ Requête réussie ! ${requests.length} demandes trouvées`);
    
    if (requests.length > 0) {
      console.log('\n📋 Exemple de données:');
      console.log(JSON.stringify(requests[0], null, 2));
    }

  } catch (error) {
    console.error('❌ Erreur générale:', error);
  }
}

testApiQuery();
