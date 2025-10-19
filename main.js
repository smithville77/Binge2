import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://wyghbayojyipfstcppsx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Z2hiYXlvanlpcGZzdGNwcHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NTc5ODcsImV4cCI6MjA3NjMzMzk4N30.dqcgwHEApi5-Omd3ezgWuFKWC8nTuyvKzyi5noZpd5A";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener("DOMContentLoaded", () => {
  const userSelect = document.getElementById("userSelect");
  const saveButton = document.getElementById("saveUser");

 
  let userId = localStorage.getItem("user");
  if (userId) {
    console.log("Existing user:", userId);
    userSelect.value = userId;
    user_select_container.style.display = "none"
  }
  let loggedInAs = document.getElementById('logged_in_as')
  loggedInAs.textContent = `User ID: ${userId}`

  saveButton.addEventListener("click", () => {
    const choice = userSelect.value;
    if (!choice) {
      alert("Please select a user first.");
      return;
    }

    localStorage.setItem("user", choice);
    console.log("User saved:", choice);
    alert(`User set to ${choice}`);
    window.location.reload()
  });



console.log("Current user:", userId);



const selectedOptionDiv = document.getElementById("selected_option");

const noButton = document
  .getElementById("no")
  .addEventListener("click", () => choiceNo());
const yesButton = document
  .getElementById("yes")
  .addEventListener(
    "click",
    () => choiceYes()
  );

// select top 1 where name_id not in names.id order by id asc
async function testConnection() {
  try {
    const { data, error } = await supabase.from("Names").select("*").limit(1);

    if (error) {
      console.error("Supabase connection failed:", error);
    } else {
      console.log("Supabase connection successful:", data);
    }
  } catch (err) {
    console.error("Unexpected error:", err);
  }
}
const nameTitle = document.getElementById("name_title");

async function populateChoice() {
  try {
    // get current choice from choices table for this user
    // select top 1 name where id not in choices[name_id] order by id asc
    const { data, error } = await supabase
      .rpc("get_unselected_names", { user_id_input: userId })
      .limit(1);
    console.log(data);
    nameTitle.textContent = `Name: ${data[0].name}`;
    nameTitle.value = data[0].id;
  } catch (error) {
    console.log(error);
  }
}

populateChoice();

// async function getFemaleNames() {
//   try {
//     const { data, error } = await supabase
//       .from("Names")
//       .select("*")
//       .eq("gender", "Female")
//       .limit(5);

//     console.log(data);
//   } catch (error) {
//     console.error(error);
//   }
// }
// getFemaleNames();

async function choiceNo() {
  console.log(nameTitle.value);
  
  const { data, error } = await supabase
    .from("Choices")
    .insert([{ name_id: nameTitle.value, user_id: userId, answer: 0 }]);
    setTimeout(5000, window.location.reload())

  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Data inserted:", data);
  }
}
async function choiceYes() {
  console.log(nameTitle.value);
  
  const { data, error } = await supabase
    .from("Choices")
    .insert([{ name_id: nameTitle.value, user_id: userId, answer: 1 }]);
    setTimeout(5000, window.location.reload())

  if (error) {
    console.error("Error inserting data:", error);
  } else {
    console.log("Data inserted:", data);
  }
}

// save choice as no
// save choice as yes



testConnection();

// get list of my 'Yes'
// get mutual yes
let choicesButton = document.getElementById("mutual_choice_button");
// choices.addEventListener("click", () => getMutualChoices())
let choiceDiv = document.getElementById("mutual_choices")

choicesButton.addEventListener('click', async () => {
  const { data, error } = await supabase.from('mutual_likes').select('*');
  if (error) {
    console.error(error);
    choiceDiv.textContent = 'Error fetching mutual choices';
  } else if (data.length === 0) {
    choiceDiv.textContent = 'No mutual likes found';
  } else {
    choiceDiv.innerHTML = data.map(d => `<p>${d.name}</p>`).join('');
  }
});

})


