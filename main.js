import { createClient } from "https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm";

const supabaseUrl = "https://wyghbayojyipfstcppsx.supabase.co";
const supabaseAnonKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind5Z2hiYXlvanlpcGZzdGNwcHN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA3NTc5ODcsImV4cCI6MjA3NjMzMzk4N30.dqcgwHEApi5-Omd3ezgWuFKWC8nTuyvKzyi5noZpd5A";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

document.addEventListener("DOMContentLoaded", () => {
  const userSelect = document.getElementById("userSelect");
  const userSelectContainer = document.getElementById("user_select_container");
  const saveButton = document.getElementById("saveUser");
  const nameTitle = document.getElementById("name_title");
  const loggedInAs = document.getElementById("logged_in_as");
  const mutualButton = document.getElementById("mutual_choice_button");
  const mutualDiv = document.getElementById("mutual_choices");

  let userId = localStorage.getItem("user");

  // --- Handle saved user ---
  if (userId) {
    console.log("Existing user:", userId);
    userSelect.value = userId;
    loggedInAs.textContent = `User ID: ${userId}`;
    userSelectContainer.style.display = "none";
  }

  saveButton.addEventListener("click", () => {
    const choice = userSelect.value;
    if (!choice) return alert("Please select a user first.");

    localStorage.setItem("user", choice);
    alert(`User set to ${choice}`);
    window.location.reload();
  });

  // --- Utility: test connection ---
  async function testConnection() {
    const { data, error } = await supabase.from("Names").select("*").limit(1);
    if (error) console.error("Supabase connection failed:", error);
    else console.log("Supabase connected:", data);
  }
  testConnection();

  // --- Fetch next available name ---
  async function populateChoice() {
    if (!userId) return;

    try {
      const { data, error } = await supabase
        .rpc("get_unselected_names", { user_id_input: userId })
        .limit(1);

      if (error) throw error;

      if (!data || data.length === 0) {
        nameTitle.textContent = "No more names left!";
        nameTitle.value = "";
        return;
      }

      nameTitle.textContent = data[0].name;
      nameTitle.value = data[0].id;
    } catch (err) {
      console.error("Error populating choice:", err);
      nameTitle.textContent = "Error fetching name";
    }
  }

  populateChoice();

  // --- Handle Like / Hate buttons ---
  async function submitChoice(answer) {
    if (!nameTitle.value) return;

    try {
      const { error } = await supabase.from("Choices").insert([
        {
          name_id: nameTitle.value,
          user_id: userId,
          answer: answer ? 1 : 0,
        },
      ]);

      if (error) throw error;

      console.log("Choice saved:", { userId, nameId: nameTitle.value, answer });
      await populateChoice(); // move to next name immediately
    } catch (err) {
      console.error("Error submitting choice:", err);
    }
  }

  document.getElementById("yes").addEventListener("click", () => submitChoice(true));
  document.getElementById("no").addEventListener("click", () => submitChoice(false));

  // --- Fetch mutual likes ---
  mutualButton.addEventListener("click", async () => {
    try {
      const { data, error } = await supabase.from("mutual_likes").select("*");
      if (error) throw error;

      if (!data || data.length === 0) {
        mutualDiv.textContent = "No mutual likes found.";
        return;
      }

      mutualDiv.innerHTML = data.map((d) => `<p>${d.name}</p>`).join("");
    } catch (err) {
      console.error("Error fetching mutual likes:", err);
      mutualDiv.textContent = "Error fetching mutual choices.";
    }
  });
});
