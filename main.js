
    import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

   
    const supabaseUrl = 'https://wyghbayojyipfstcppsx.supabase.co'
    const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Z2hiYXlvanlpcGZzdGNwcHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NTc5ODcsImV4cCI6MjA3NjMzMzk4N30.dqcgwHEApi5-Omd3ezgWuFKWC8nTuyvKzyi5noZpd5A'


const supabase = createClient(supabaseUrl, supabaseAnonKey)


const testButton = document.getElementById("test")
testButton.addEventListener("click", () => alert("Hello!"))


async function testConnection() {
  try {
    const { data, error } = await supabase
      .from('Names')  
      .select('*')
      .limit(1)
      

    if (error) {
      console.error('Supabase connection failed:', error)
    } else {
      console.log('Supabase connection successful:', data)
    }
  } catch (err) {
    console.error('Unexpected error:', err)
  }
}


testConnection()
