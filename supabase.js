
const SUPABASE_URL = 'https://znubayscztsrerushofz.supabase.co';

const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpudWJheXNjenRzcmVydXNob2Z6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTE1MjA4NTcsImV4cCI6MjEwNzA5Njg1N30.PN6JC8Kq1zNF58ZqmkjbTehnR5gjcBeq19gajPIiO5c';

window.supabaseClient = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_ANON_KEY
);