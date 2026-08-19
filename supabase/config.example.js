// Kopieer naar config.js en vul de publieke projectwaarden uit Supabase in.
// Gebruik de Publishable key (aanbevolen) of legacy anon key.
// Zet NOOIT een Secret key / service_role key in deze browsercode.
window.MIJNTELEWERK_CONFIG = {
  SUPABASE_URL: 'https://JOUW-PROJECT.supabase.co',
  SUPABASE_PUBLISHABLE_KEY: 'sb_publishable_...',
  // Alleen nodig bij oudere Supabase-projecten zonder publishable key:
  SUPABASE_ANON_KEY: '',
  // Contactadres voor feedback/bugs/suggesties vanuit de ?-uitleg:
  FEEDBACK_EMAIL: 'feedback@mijntelewerk.be'
};
