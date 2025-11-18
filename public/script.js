let students = [];
let parents = [];

// 🔄 Load both student + parent data from backend
fetch("http://localhost:5000/get-data")
  .then(res => res.json())
  .then(data => {
    students = data.students;
    parents = data.parents;

    console.log("✅ Students:", students);
    console.log("✅ Parents:", parents);

    // Fill the student dropdown
    const select = document.getElementById("studentSelect");
    students.forEach(s => {
      const option = document.createElement("option");
      option.value = s["Student Name"];
      option.textContent = s["Student Name"];
      select.appendChild(option);
    });
  })
  .catch(err => console.error("❌ Error loading data:", err));

// 📩 Function to send SMS
function sendSMS(phone, name, customMsg = null) {
  const message =
    customMsg ||
    `Hello ${name}, you have been identified as a matching blood donor. Please respond if available.`;

  fetch("http://localhost:5000/send-sms", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ to: phone, body: message }),
  })
    .then(res => res.json())
    .then(data => alert(`📤 Message sent to ${name}: ${data.status}`))
    .catch(err => {
      console.error("Error sending SMS:", err);
      alert("❌ Failed to send SMS.");
    });
}

// 🚨 Notify Parent + Classmates
document.getElementById("notifyBtn").addEventListener("click", () => {
  const studentName = document.getElementById("studentSelect").value;
  if (!studentName) {
    alert("Please select a student.");
    return;
  }

  const student = students.find(s => s["Student Name"] === studentName);
  if (!student) {
    alert("Student not found!");
    return;
  }

  const parentName = student["Parent Name"];
  const parent = parents.find(p => p["Parent Name"] === parentName);

  // 1️⃣ Notify Parent
  if (parent && parent["Parent Mobile"]) {
    const parentMsg = `🚨 Emergency Alert: Your child ${studentName} (${student["Blood Group"]}) needs blood urgently. Please reach out immediately.`;
    sendSMS(parent["Parent Mobile"], parentName, parentMsg);
  }

  // 2️⃣ Notify Classmates
  const classMsg = `⚠️ Emergency Alert: ${studentName} (${student["Blood Group"]}) needs blood urgently. Please contact immediately.`;
  students.forEach(s => {
    if (s["Student Mobile"]) {
      fetch("http://localhost:5000/send-sms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ to: s["Student Mobile"], body: classMsg }),
      }).catch(err => console.error("Error sending class SMS:", err));
    }
  });

  alert(`✅ Notification sent for ${studentName} to parent and classmates.`);
});

// 🩸 Automatically select blood group when a student is chosen
document.getElementById("studentSelect").addEventListener("change", (e) => {
  const studentName = e.target.value;
  const student = students.find(s => s["Student Name"] === studentName);

  if (student) {
    document.getElementById("bloodGroup").value = student["Blood Group"];
  }
});

// 🔍 Search Donors by Blood Group
document.getElementById("searchBtn").addEventListener("click", () => {
  const group = document.getElementById("bloodGroup").value.trim();
  const results = document.getElementById("results");
  results.innerHTML = "";

  if (!group) {
    results.textContent = "Please select a blood group.";
    return;
  }

  const matches = students.filter(s => s["Blood Group"] === group);
  if (matches.length === 0) {
    results.textContent = `No donors found for ${group}.`;
    return;
  }

  const table = document.createElement("table");
  const headerRow = document.createElement("tr");
  ["Student Name", "Student Mobile", "Action"].forEach(h => {
    const th = document.createElement("th");
    th.textContent = h;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  matches.forEach(s => {
    const row = document.createElement("tr");
    ["Student Name", "Student Mobile"].forEach(h => {
      const td = document.createElement("td");
      td.textContent = s[h];
      row.appendChild(td);
    });

    const actionTd = document.createElement("td");
    const btn = document.createElement("button");
    btn.textContent = "Send SMS";
    btn.className = "sms-btn";
    btn.addEventListener("click", () =>
      sendSMS(s["Student Mobile"], s["Student Name"])
    );
    actionTd.appendChild(btn);
    row.appendChild(actionTd);

    table.appendChild(row);
  });

  results.appendChild(table);
});
