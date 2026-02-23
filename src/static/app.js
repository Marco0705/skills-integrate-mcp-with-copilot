document.addEventListener("DOMContentLoaded", () => {
  const activitiesList = document.getElementById("activities-list");
  const activitySelect = document.getElementById("activity");
  const signupForm = document.getElementById("signup-form");

    const activity = button.getAttribute("data-activity");
    const email = button.getAttribute("data-email");

    try {
      const response = await fetch(
    const filterText = document.getElementById("filter-text");
    const sortSelect = document.getElementById("sort-select");
    let allActivities = {};
        `/activities/${encodeURIComponent(
    // Render activities with filtering and sorting
    function renderActivities(activities) {
      // Get filter and sort values
      const filter = filterText.value.trim().toLowerCase();
      const sortBy = sortSelect.value;

      // Convert activities object to array
      let activityArr = Object.entries(activities);

      // Filter
      if (filter) {
        activityArr = activityArr.filter(([name, details]) =>
          name.toLowerCase().includes(filter) ||
          (details.description && details.description.toLowerCase().includes(filter))
        );
      }

      // Sort
      activityArr.sort((a, b) => {
        if (sortBy === "name") {
          return a[0].localeCompare(b[0]);
        } else if (sortBy === "participants") {
          return b[1].participants.length - a[1].participants.length;
        } else if (sortBy === "availability") {
          const aAvail = a[1].max_participants - a[1].participants.length;
          const bAvail = b[1].max_participants - b[1].participants.length;
          return bAvail - aAvail;
        }
        return 0;
      });

      // Clear list
      activitiesList.innerHTML = "";

      // Populate activities list
      activityArr.forEach(([name, details]) => {
        const activityCard = document.createElement("div");
        activityCard.className = "activity-card";

        const spotsLeft = details.max_participants - details.participants.length;

        // Create participants HTML with delete icons instead of bullet points
        const participantsHTML =
          details.participants.length > 0
            ? `<div class="participants-section">
                <h5>Participants:</h5>
                <ul class="participants-list">
                  ${details.participants
                    .map(
                      (email) =>
                        `<li><span class="participant-email">${email}</span><button class="delete-btn" data-activity="${name}" data-email="${email}">❌</button></li>`
                    )
                    .join("")}
                </ul>
              </div>`
            : `<p><em>No participants yet</em></p>`;

        activityCard.innerHTML = `
          <h4>${name}</h4>
          <p>${details.description}</p>
          <p><strong>Schedule:</strong> ${details.schedule}</p>
          <p><strong>Availability:</strong> ${spotsLeft} spots left</p>
          <div class="participants-container">
            ${participantsHTML}
          </div>
        `;

        activitiesList.appendChild(activityCard);
      });

      // Add event listeners to delete buttons
      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", handleUnregister);
      });
    }

    // Function to fetch activities from API
    async function fetchActivities() {
      try {
        const response = await fetch("/activities");
        const activities = await response.json();
        allActivities = activities;

        // Populate select dropdown
        activitySelect.innerHTML = '<option value="">-- Select an activity --</option>';
        Object.keys(activities).forEach((name) => {
          const option = document.createElement("option");
          option.value = name;
          option.textContent = name;
          activitySelect.appendChild(option);
        });

        renderActivities(activities);
      } catch (error) {
        activitiesList.innerHTML =
          "<p>Failed to load activities. Please try again later.</p>";
        console.error("Error fetching activities:", error);
      }
    }
        messageDiv.className = "error";
      }

      messageDiv.classList.remove("hidden");

      // Hide message after 5 seconds
      setTimeout(() => {
        messageDiv.classList.add("hidden");
      }, 5000);
    } catch (error) {
      messageDiv.textContent = "Failed to sign up. Please try again.";
      messageDiv.className = "error";
      messageDiv.classList.remove("hidden");
      console.error("Error signing up:", error);
    }
  });

  // Filter and sort listeners
  filterText.addEventListener("input", () => renderActivities(allActivities));
  sortSelect.addEventListener("change", () => renderActivities(allActivities));

  // Initialize app
  fetchActivities();
});
