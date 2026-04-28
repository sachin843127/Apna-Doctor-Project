const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../auth/auth.html";
}

// ✅ NAME DIRECT READ
const userName = localStorage.getItem("userName") || "User";
const userId = localStorage.getItem("userId");
const user = userId ? { _id: userId, name: userName } : null;

// TOP BAR
document.getElementById("topUserName").innerText = userName;

// GREETING
document.getElementById("greetText").innerText =
  `Hello ${userName}, how are you feeling today?`;

// const token = localStorage.getItem("token");

// if (!token) {
//   window.location.href = "../auth/auth.html";
// }

// // 👇 USER OBJECT READ KARO
// const user = JSON.parse(localStorage.getItem("user"));

// const userName = user?.name || "User";

// // TOP BAR NAME
// document.getElementById("topUserName").innerText = userName;

// // GREETING
// document.getElementById("greetText").innerText =
//   `Hello ${userName}, how are you feeling today?`;


//   document.getElementById("topUserName").innerText = userName;




// Basic frontend interactions and localStorage placeholder for records
document.addEventListener('DOMContentLoaded', () => {

 
  // Elements
  const navItems = document.querySelectorAll('.nav-item');
  const views = {
    dashboard: document.getElementById('dashboardView'),
    login: document.getElementById('loginView'),
    symptom: document.getElementById('symptomView'),
    records: document.getElementById('recordsView'),
    locator: document.getElementById('locatorView'),
    profile: document.getElementById('profileView'),
    medicine: document.getElementById('medicineView')
  };

  

  // Helper: show view
  function showView(name){
    Object.values(views).forEach(v => v.classList.add('hidden'));
    if(views[name]) views[name].classList.remove('hidden');

     const startSymptomBtn = document.getElementById("startSymptomBtn");

if (startSymptomBtn) {
  startSymptomBtn.addEventListener("click", () => {
    showView("symptom");
  });
}

    // highlight nav
    navItems.forEach(it => it.classList.toggle('active', it.dataset.view === name));
  }

  // Init show dashboard
  showView('dashboard');

  // Nav click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      showView(view);
    });
  });

  // Card action buttons
  document.querySelectorAll('[data-action="open"]').forEach(btn => {
    btn.addEventListener('click', e => {
      const target = e.currentTarget.dataset.target;
      showView(target);
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });


  

  // Start symptom button -> open modal then go to symptom
  // const startSymptomBtn = document.getElementById('startSymptomBtn');
  // const modal = document.getElementById('modalOverlay');
  // const modalClose = document.getElementById('modalClose');
  // const modalGo = document.getElementById('modalGo');
  // if(startSymptomBtn){
  //   startSymptomBtn.addEventListener('click', () => {
  //     modal.classList.remove('hidden');
  //   });
  // }
  // if(modalClose) modalClose.addEventListener('click', () => modal.classList.add('hidden'));
  // if(modalGo) modalGo.addEventListener('click', () => { modal.classList.add('hidden'); showView('symptom'); });

  // Shortcuts: topbar search button
  document.getElementById('searchBtn').addEventListener('click', () => {
    const q = document.getElementById('search').value.trim().toLowerCase();
    if(!q) { alert('Please type to search.'); return; }

    const map = {
      dashboard: ['dashboard', 'home'],
      symptom: ['symptom', 'symptoms', 'check'],
      records: ['records', 'record', 'history', 'my records'],
      locator: ['locator', 'hospital', 'hospitals', 'map'],
      profile: ['profile', 'account'],
      medicine: ['chat', 'doctor', 'doctor chat']
    };

    const target = Object.keys(map).find(key =>
      map[key].some(k => q.includes(k))
    );

    if (target && views[target]) {
      showView(target);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    alert('No matching section found. Try: profile, chat, records, locator.');
  });

  // Symptom form logic (simple rule-based detection)
  const symptomForm = document.getElementById('symptomForm');
  const resultBox = document.getElementById('symptomResult');
  const resultList = document.getElementById('resultList');

  function simpleDetect(symptoms){
    // Very naive mapping for demo — replace with ML/backend in future
    const mapping = [
      {tags: ['fever','cough'], cond: 'Common Cold / Flu'},
      {tags: ['fever','headache','vomiting'], cond: 'Viral Infection'},
      {tags: ['sore_throat','cough'], cond: 'Throat Infection'},
      {tags: ['fatigue','headache'], cond: 'Dehydration / Fatigue'},
      {tags: ['vomiting','fever'], cond: 'Food Poisoning'}
    ];
    const found = new Set();
    mapping.forEach(m => {
      if(m.tags.every(t => symptoms.includes(t))) found.add(m.cond);
    });
    // fallback: if any symptom
    if(found.size === 0 && symptoms.length>0){
      found.add('General Checkup recommended — minor condition possible');
    }
    if(symptoms.length === 0) found.add('No symptoms selected');
    return Array.from(found);
  }

  if(symptomForm){
    symptomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const age = document.getElementById('age').value;
      const checked = Array.from(symptomForm.querySelectorAll('input[name="symptom"]:checked')).map(i => i.value);

      const results = simpleDetect(checked);
      resultList.innerHTML = results.map(r => `<li>${r}</li>`).join('');
      resultBox.classList.remove('hidden');

      // Save record locally (for demo / backend-ready)
      const records = JSON.parse(localStorage.getItem('apna_records') || '[]');
      records.unshift({
        id: Date.now(),
        name, age, symptoms: checked,
        results, createdAt: new Date().toISOString()
      });
      localStorage.setItem('apna_records', JSON.stringify(records));
      renderRecords();
    });
  }

  // Render records
  function renderRecords(){
    const container = document.getElementById('recordsList');
    const records = JSON.parse(localStorage.getItem('apna_records') || '[]');
    if(!records.length){
      container.innerHTML = '<p>No records yet.</p>';
      return;
    }
    container.innerHTML = records.map(r => {
      return `<div class="record-item" style="padding:10px;border-radius:10px;margin-bottom:8px;background:#fff;box-shadow:0 6px 14px rgba(10,30,30,0.04)">
        <strong>${r.name || 'Unknown'}</strong> • Age: ${r.age || '-'} <br/>
        <small>${new Date(r.createdAt).toLocaleString()}</small>
        <div style="margin-top:6px">Symptoms: ${r.symptoms.join(', ') || 'None'}</div>
        <div style="margin-top:6px;color:#0f3b43;font-weight:600">Results: ${r.results.join(' · ')}</div>
      </div>`;
    }).join('');
  }
  renderRecords();

  // Open maps action
  document.getElementById('openMaps').addEventListener('click', () => {
    const mapWrap = document.getElementById("mapWrap");
    const mapFrame = document.getElementById("mapFrame");

    const showMap = (lat, lng) => {
      const q = lat && lng
        ? `https://www.google.com/maps?q=hospitals%20near%20me&ll=${lat},${lng}&z=14&output=embed`
        : "https://www.google.com/maps?q=hospitals%20near%20me&output=embed";
      mapFrame.src = q;
      mapWrap.classList.remove("hidden");
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => showMap(pos.coords.latitude, pos.coords.longitude),
        () => showMap()
      );
    } else {
      showMap();
    }
  });

  // Simple login (demo)
  document.getElementById('loginForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    // For demo: no real auth. In future connect to backend auth API
    alert(`Logged in as ${email} (demo)`);
    showView('dashboard');
  });

  // On load highlight active nav item
  navItems.forEach(it => {
    it.classList.toggle('active', it.dataset.view === 'dashboard');
  });

  // Start Symptom Check button → open the other page
const startSymptomBtn = document.getElementById('startSymptomBtn');
if (startSymptomBtn) {
  startSymptomBtn.addEventListener('click', () => {
    const token = localStorage.getItem("token");

if (!token) {
  window.location.href = "../auth/auth.html";
}

// ✅ NAME DIRECT READ
const userName = localStorage.getItem("userName") || "User";

// TOP BAR
document.getElementById("topUserName").innerText = userName;

// GREETING
document.getElementById("greetText").innerText =
  `Hello ${userName}, how are you feeling today?`;

// const token = localStorage.getItem("token");

// if (!token) {
//   window.location.href = "../auth/auth.html";
// }

// // 👇 USER OBJECT READ KARO
// const user = JSON.parse(localStorage.getItem("user"));

// const userName = user?.name || "User";

// // TOP BAR NAME
// document.getElementById("topUserName").innerText = userName;

// // GREETING
// document.getElementById("greetText").innerText =
//   `Hello ${userName}, how are you feeling today?`;


//   document.getElementById("topUserName").innerText = userName;




// Basic frontend interactions and localStorage placeholder for records
document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const navItems = document.querySelectorAll('.nav-item');
  const views = {
    dashboard: document.getElementById('dashboardView'),
    login: document.getElementById('loginView'),
    symptom: document.getElementById('symptomView'),
    records: document.getElementById('recordsView'),
    locator: document.getElementById('locatorView'),
    profile: document.getElementById('profileView'),
    medicine: document.getElementById('medicineView')
  };

  // Helper: show view
  function showView(name){
    Object.values(views).forEach(v => v.classList.add('hidden'));
    if(views[name]) views[name].classList.remove('hidden');

    // highlight nav
    navItems.forEach(it => it.classList.toggle('active', it.dataset.view === name));
  }

  // Init show dashboard
  showView('dashboard');

  // Nav click
  navItems.forEach(item => {
    item.addEventListener('click', () => {
      const view = item.dataset.view;
      showView(view);
    });
  });

  // Card action buttons
  document.querySelectorAll('[data-action="open"]').forEach(btn => {
    btn.addEventListener('click', e => {
      const target = e.currentTarget.dataset.target;
      showView(target);
      window.scrollTo({top:0,behavior:'smooth'});
    });
  });

  // Start symptom button -> open modal then go to symptom
  // const startSymptomBtn = document.getElementById('startSymptomBtn');
  // const modal = document.getElementById('modalOverlay');
  // const modalClose = document.getElementById('modalClose');
  // const modalGo = document.getElementById('modalGo');
  // if(startSymptomBtn){
  //   startSymptomBtn.addEventListener('click', () => {
  //     modal.classList.remove('hidden');
  //   });
  // }
  // if(modalClose) modalClose.addEventListener('click', () => modal.classList.add('hidden'));
  // if(modalGo) modalGo.addEventListener('click', () => { modal.classList.add('hidden'); showView('symptom'); });

  // Shortcuts: topbar search button
  document.getElementById('searchBtn').addEventListener('click', () => {
    const q = document.getElementById('search').value.trim();
    if(!q) { alert('Please type to search.'); return; }
    alert(`Search for: ${q} (placeholder)`);
  });

  // Symptom form logic (simple rule-based detection)
  const symptomForm = document.getElementById('symptomForm');
  const resultBox = document.getElementById('symptomResult');
  const resultList = document.getElementById('resultList');

  function simpleDetect(symptoms){
    // Very naive mapping for demo — replace with ML/backend in future
    const mapping = [
      {tags: ['fever','cough'], cond: 'Common Cold / Flu'},
      {tags: ['fever','headache','vomiting'], cond: 'Viral Infection'},
      {tags: ['sore_throat','cough'], cond: 'Throat Infection'},
      {tags: ['fatigue','headache'], cond: 'Dehydration / Fatigue'},
      {tags: ['vomiting','fever'], cond: 'Food Poisoning'}
    ];
    const found = new Set();
    mapping.forEach(m => {
      if(m.tags.every(t => symptoms.includes(t))) found.add(m.cond);
    });
    // fallback: if any symptom
    if(found.size === 0 && symptoms.length>0){
      found.add('General Checkup recommended — minor condition possible');
    }
    if(symptoms.length === 0) found.add('No symptoms selected');
    return Array.from(found);
  }

  if(symptomForm){
    symptomForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('name').value.trim();
      const age = document.getElementById('age').value;
      const checked = Array.from(symptomForm.querySelectorAll('input[name="symptom"]:checked')).map(i => i.value);

      const results = simpleDetect(checked);
      resultList.innerHTML = results.map(r => `<li>${r}</li>`).join('');
      resultBox.classList.remove('hidden');

      // Save record locally (for demo / backend-ready)
      const records = JSON.parse(localStorage.getItem('apna_records') || '[]');
      records.unshift({
        id: Date.now(),
        name, age, symptoms: checked,
        results, createdAt: new Date().toISOString()
      });
      localStorage.setItem('apna_records', JSON.stringify(records));
      renderRecords();
    });
  }

  // Render records
  function renderRecords(){
    const container = document.getElementById('recordsList');
    const records = JSON.parse(localStorage.getItem('apna_records') || '[]');
    if(!records.length){
      container.innerHTML = '<p>No records yet.</p>';
      return;
    }
    container.innerHTML = records.map(r => {
      return `<div class="record-item" style="padding:10px;border-radius:10px;margin-bottom:8px;background:#fff;box-shadow:0 6px 14px rgba(10,30,30,0.04)">
        <strong>${r.name || 'Unknown'}</strong> • Age: ${r.age || '-'} <br/>
        <small>${new Date(r.createdAt).toLocaleString()}</small>
        <div style="margin-top:6px">Symptoms: ${r.symptoms.join(', ') || 'None'}</div>
        <div style="margin-top:6px;color:#0f3b43;font-weight:600">Results: ${r.results.join(' · ')}</div>
      </div>`;
    }).join('');
  }
  renderRecords();

  // Open maps action
  document.getElementById('openMaps').addEventListener('click', () => {
    // This opens Google Maps searching for nearby hospitals — user location permission handled by browser/maps
    window.open('https://www.google.com/maps/search/hospitals+near+me', '_blank');
  });

  // Simple login (demo)
  document.getElementById('loginForm')?.addEventListener('submit', function(e){
    e.preventDefault();
    const email = document.getElementById('email').value;
    // For demo: no real auth. In future connect to backend auth API
    alert(`Logged in as ${email} (demo)`);
    showView('dashboard');
  });

  // On load highlight active nav item
  navItems.forEach(it => {
    it.classList.toggle('active', it.dataset.view === 'dashboard');
  });

  // Start Symptom Check button → open the other page


const startSymptomBtn = document.getElementById('startSymptomBtn');
if (startSymptomBtn) {
  startSymptomBtn.addEventListener('click', () => {
     showView("symptom"); 
    // navigate to symptoms checker folder index.html
    // window.location.href = '../Symptoms-Check/index.html';
     
  });
}


document
  .querySelector(".nav-item[data-view='symptom']")
  .addEventListener("click", () => {
    // loadPage("symptom/symptom.html");
  });

// Sidebar symptom check click → open Symptoms-Check page
const sidebarSymptomBtn = document.querySelector('.nav-item[data-view="symptom"]');
if (sidebarSymptomBtn) {
  sidebarSymptomBtn.addEventListener('click', (e) => {
    e.preventDefault(); // default hide-show prevent karne ke liye
    // window.location.href = '../Symptoms-Check/index.html';
  });
}

});





document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userName");

  window.location.href = "../frontend/auth/auth.html";
});



// function loadPage(page) {
//   fetch(page)
//     .then(res => res.text())
//     .then(html => {
//       document.getElementById("dynamicContent").innerHTML = html;
//     })
//     .catch(err => {
//       console.error(err);
//       document.getElementById("dynamicContent").innerHTML =
//         "<p style='color:red'>Page load failed</p>";
//     });
// }





// CARD CLICK

// document.querySelectorAll("[data-view='symptom']").forEach(btn => {
//   btn.addEventListener("click", () => {
//     loadPage("symptom/symptom.html");
//   });
// });


// document
//   .getElementById("startSymptomBtn")
//   .addEventListener("click", () => {
//     loadPage("symptom/symptom.html");
//   });

    // navigate to symptoms checker folder index.html
    // window.location.href = '../Symptoms-Check/index.html';
     
  });
}


// document
//   .querySelector(".nav-item[data-view='symptom']")
//   .addEventListener("click", () => {
//     loadPage("symptom/symptom.html");
//   });

// Sidebar symptom check click → open Symptoms-Check page
const sidebarSymptomBtn = document.querySelector('.nav-item[data-view="symptom"]');
if (sidebarSymptomBtn) {
  sidebarSymptomBtn.addEventListener('click', (e) => {
    e.preventDefault(); // default hide-show prevent karne ke liye
    // window.location.href = '../Symptoms-Check/index.html';
  });
}

});





document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("userName");

  window.location.href = "../frontend/auth/auth.html";
});



// function loadPage(page) {
//   fetch(page)
//     .then(res => res.text())
//     .then(html => {
//       document.getElementById("dynamicContent").innerHTML = html;
//     })
//     .catch(err => {
//       console.error(err);
//       document.getElementById("dynamicContent").innerHTML =
//         "<p style='color:red'>Page load failed</p>";
//     });
// }

// CARD CLICK

// document.querySelectorAll("[data-view='symptom']").forEach(btn => {
//   btn.addEventListener("click", () => {
//     loadPage("symptom/symptom.html");
//   });
// });

// document
//   .getElementById("startSymptomBtn")
//   .addEventListener("click", () => {
//     loadPage("symptom/symptom.html");
//   });




// sidebar buttons

// document.querySelectorAll(".nav-item").forEach(item => {
//   item.addEventListener("click", () => {
//     const view = item.dataset.view;
//     if (view) {
//       showView(view);

//       // active class
//       document.querySelectorAll(".nav-item").forEach(i =>
//         i.classList.remove("active")
//       );
//       item.classList.add("active");
//     }
//   });
// });



// ================== Symptom Checker Logic ==================
const checkBtn = document.getElementById("checkSymptomBtn");

if (checkBtn) {
  checkBtn.addEventListener("click", () => {
    const input = document.getElementById("symptomInput").value.trim().toLowerCase();
    const output = document.getElementById("symptomOutput");
    const diseaseText = document.getElementById("diseaseText");

    const doList = document.getElementById("doList");
    const dontList = document.getElementById("dontList");
    const dietList = document.getElementById("dietList");
    const homeList = document.getElementById("homeList");
    const emergencyBox = document.getElementById("emergencyBox");

    if (!input) {
      alert("Please apni problem likhiye");
      return;
    }

    // clear old data
    doList.innerHTML = "";
    dontList.innerHTML = "";
    dietList.innerHTML = "";
    homeList.innerHTML = "";
    emergencyBox.classList.add("hidden");

    // ---- BASIC ANALYSIS (temporary logic) ----
    if (input.includes("bukhar") || input.includes("fever")) {
      diseaseText.innerText = "Aapko viral fever ya infection ho sakta hai.";

      addItems(doList, ["Aaram karein", "Paani zyada piyen", "Doctor se salah lein"]);
      addItems(dontList, ["Thanda pani na piyen", "Overexertion na karein"]);
      addItems(dietList, ["Soup", "Haldi wala doodh", "Light food"]);
      addItems(homeList, ["Steam lein", "Garam paani se gargle"]);
    } 
    else if (input.includes("chest pain") || input.includes("saans")) {
      diseaseText.innerText = "Ye serious problem ho sakti hai.";

      emergencyBox.classList.remove("hidden");
    } 
    else {
      diseaseText.innerText =
        "Exact condition identify karna mushkil hai, lekin general care follow karein.";

      addItems(doList, ["Rest lein", "Hydrated rahein"]);
      addItems(dontList, ["Stress na lein"]);
      addItems(dietList, ["Healthy food"]);
      addItems(homeList, ["Proper sleep"]);
    }

    output.classList.remove("hidden");
  });
}

// helper function
function addItems(list, items) {
  items.forEach(item => {
    const li = document.createElement("li");
    li.textContent = item;
    list.appendChild(li);
  });
}






let diseaseDB = [];

fetch("symptom/diseases.json")
  .then(res => res.json())
  .then(data => {
    diseaseDB = data;
    console.log("Disease DB Loaded", diseaseDB.length);
  })
  .catch(err => console.error("Disease JSON load failed", err));





function showLocalResult(d) {
  symptomOutput.classList.remove("hidden");

  diseaseText.innerText = d.name;

  fillList(doList, d.do);
  fillList(dontList, d.dont);
  fillList(dietList, d.diet);
  fillList(homeList, d.home);

  if (d.emergency) {
    emergencyBox.classList.remove("hidden");
  } else {
    emergencyBox.classList.add("hidden");
  }
}

function showAIPlaceholder() {
  symptomOutput.classList.remove("hidden");
  diseaseText.innerText = "AI Analysis Required";

  doList.innerHTML = `<li>AI se detailed analysis li ja rahi hai</li>`;
  dontList.innerHTML = "";
  dietList.innerHTML = "";
  homeList.innerHTML = "";

  emergencyBox.classList.add("hidden");
}

function fillList(el, arr = []) {
  el.innerHTML = arr.map(i => `<li>${i}</li>`).join("");
}


// if (data.followUpQuestion) {
//   document.getElementById("followUpQuestion").innerText =
//     data.followUpQuestion;

//   document.getElementById("followUpBox")
//     .classList.remove("hidden");
// }



// fetch("/api/symptom/analyze", {
//   method: "POST",
//   headers: { "Content-Type": "application/json" },
//   body: JSON.stringify({
//     text: originalText + " " + followUpAnswer
//   })
// });


document.addEventListener("click", async function (e) {

  // ✅ Symptom Analyze Button
  if (e.target && e.target.id === "checkSymptomBtn") {

    const symptomInput = document.getElementById("symptomInput");
    const text = symptomInput.value.trim();

    if (!text) {
      alert("Please apni problem likhiye");
      return;
    }

    const lowerText = text.toLowerCase();
    const found = diseaseDB.find(d =>
      d.keywords.some(k => lowerText.includes(k))
    );

    if (found) {
      showLocalResult(found);

      if (user) {
        await fetch("http://localhost:5000/api/records/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user._id,
            name: user.name,
            symptomText: text,
            disease: found.name
          })
        });
        loadRecords();
      } else {
        alert("Please login again");
      }

      return;
    }
    const outputBox = document.getElementById("symptomOutput");
    const diseaseText = document.getElementById("diseaseText");
    const doList = document.getElementById("doList");
    const dontList = document.getElementById("dontList");
    const dietList = document.getElementById("dietList");
    const homeList = document.getElementById("homeList");
    const emergencyBox = document.getElementById("emergencyBox");

    e.target.innerText = "Analyzing...";
    e.target.disabled = true;

    try {
      const res = await fetch("http://localhost:5000/api/symptom/analyze", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ text })
      });

      const data = await res.json();
      console.log("AI Response:", data); // 🔍 debug


        // 2️⃣ UI update (tumhara already code)
  // document.getElementById("symptomOutput").classList.remove("hidden");
  // document.getElementById("diseaseText").innerText = data.disease;

  // (do / dont / diet / remedy fill yahin hoga)

  // 3️⃣ 🔥 RECORD SAVE — YAHI PE ADD KARNA HAI
  // await fetch("/api/records/save", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json"
  //   },
  //   body: JSON.stringify({
  //     userId: user._id,          // login user
  //     name: user.name,
  //     symptomText: symptomText,
  //     disease: data.disease
  //   })
  // });

      // show output
      outputBox.classList.remove("hidden");

      diseaseText.textContent = data.disease || "Health Insight";

      // helper
      const fillList = (el, arr = []) => {
        el.innerHTML = "";
        arr.forEach(item => {
          const li = document.createElement("li");
          li.textContent = item;
          el.appendChild(li);
        });
      };

      fillList(doList, data.do);
      fillList(dontList, data.dont);
      fillList(dietList, data.diet);
      fillList(homeList, data.remedy);

      if (data.emergency) {
        emergencyBox.classList.remove("hidden");
      } else {
        emergencyBox.classList.add("hidden");
      }

      if (user) {
        await fetch("http://localhost:5000/api/records/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            userId: user._id,
            name: user.name,
            symptomText: text,
            disease: data.disease
          })
        });
        loadRecords();
      } else {
        alert("Please login again");
      }
    } catch (err) {
      console.error(err);
      alert("Server / AI error aaya");
    } finally {
      e.target.innerText = "Analyze Symptoms";
      e.target.disabled = false;
    }
  }
});



async function loadRecords() {
  if (!user) return;
  const res = await fetch(`http://localhost:5000/api/records/${user._id}`);
  const records = await res.json();

  const container = document.getElementById("recordsList");
  if (!records.length) {
    container.innerHTML = "<p>No records yet.</p>";
    return;
  }

  container.innerHTML = records
    .map(r => `
      <div class="record-item">
        <div class="record-header">
          <span class="record-name">👤 ${r.name}</span>
          <span class="record-date">
            📅 ${new Date(r.createdAt).toLocaleDateString()}
          </span>
        </div>
        <p class="record-symptom">📝 ${r.symptomText}</p>
        <span class="record-disease">🦠 ${r.disease}</span>
      </div>
    `)
    .join("");
}

// call when records page opens
loadRecords();

async function loadProfile() {
  if (!user) return;

  try {
    const res = await fetch(`http://localhost:5000/api/auth/me/${user._id}`);
    const data = await res.json();

    document.getElementById("profileName").textContent = data.name || "-";
    document.getElementById("profileEmail").textContent = data.email || "-";
    document.getElementById("profileCreated").textContent = data.createdAt
      ? new Date(data.createdAt).toLocaleDateString()
      : "-";

    const recRes = await fetch(`http://localhost:5000/api/records/${user._id}`);
    const records = await recRes.json();

    document.getElementById("profileRecordsCount").textContent = records.length || "0";

    const recent = records.slice(0, 2);
    const recentBox = document.getElementById("profileRecent");
    if (!recent.length) {
      recentBox.textContent = "No records yet.";
      return;
    }

    recentBox.innerHTML = recent
      .map(r => `• ${r.disease} (${new Date(r.createdAt).toLocaleDateString()})`)
      .join("<br/>");
  } catch (err) {
    console.error(err);
  }
}

loadProfile();

// Doctor Chat (session only)
const chatMessages = [];

function renderChatMessage(role, text) {
  const container = document.getElementById("chatMessages");
  if (!container) return;
  const msg = document.createElement("div");
  msg.className = `chat-msg ${role}`;
  msg.textContent = text;
  container.appendChild(msg);
  container.scrollTop = container.scrollHeight;
}

async function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const sendBtn = document.getElementById("chatSend");
  if (!input || !sendBtn) return;

  const text = input.value.trim();
  if (!text) return;

  input.value = "";
  renderChatMessage("user", text);
  chatMessages.push({ role: "user", content: text });

  sendBtn.disabled = true;
  sendBtn.textContent = "Sending...";

  try {
    const res = await fetch("http://localhost:5000/api/chat/doctor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: chatMessages })
    });

    const data = await res.json();
    const reply = data.reply || "Main samajh nahi paaya, कृपया फिर से बताएं.";
    renderChatMessage("assistant", reply);
    chatMessages.push({ role: "assistant", content: reply });
  } catch (err) {
    console.error(err);
    renderChatMessage("assistant", "Server error. कृपया थोड़ी देर बाद try करें.");
  } finally {
    sendBtn.disabled = false;
    sendBtn.textContent = "Send";
  }
}

document.getElementById("chatSend")?.addEventListener("click", sendChatMessage);
document.getElementById("chatInput")?.addEventListener("keydown", (e) => {
  if (e.key === "Enter") sendChatMessage();
});

if (document.getElementById("chatMessages")) {
  renderChatMessage(
    "assistant",
    "Namaste! Apni problem bataiye. Main aap se follow-up सवाल पूछूंगा."
  );
}






