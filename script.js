// Hämta element från DOM
const targetForm = document.getElementById('bucketForm'); // Formuläret
const activityNameInput = document.getElementById('activityName'); // Input för aktivitetens namn
const activityCategorySelect = document.getElementById('activityCategory'); // Select för kategori
const targetBucketList = document.getElementById('bucketLists'); // Sektion för listan

// Ladda aktiviteter från localStorage (eller tom array om det inte finns något)
let activities = JSON.parse(localStorage.getItem('activities')) || [];

// Funktion för att uppdatera localStorage
function saveToLocalStorage() {
  localStorage.setItem('activities', JSON.stringify(activities));
}

// Funktion för att bygga och rendera listan, sorterad efter kategori
function buildUl() {
  targetBucketList.innerHTML = ''; // Töm listan innan rendering

  // Gruppera aktiviteter efter kategori
  const groupedActivities = activities.reduce((acc, activity) => {
    const category = activity.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(activity.name);
    return acc;
  }, {});

  // Sortera kategorierna i bokstavsordning
  const sortedCategories = Object.keys(groupedActivities).sort();

  // Bygg <ul> per kategori
  sortedCategories.forEach((category) => {
    const ul = document.createElement('ul');
    const categoryHeader = document.createElement('h3');
    categoryHeader.textContent = category;

    ul.appendChild(categoryHeader);

    // Sortera aktiviteter inom kategorin
    groupedActivities[category].sort().forEach((activity) => {
      const li = document.createElement('li');
      li.textContent = activity;

      // Lägg till en ta bort-knapp för varje aktivitet
      const removeButton = document.createElement('button');
      removeButton.textContent = 'Ta bort';
      removeButton.addEventListener('click', () => {
        removeActivity(activity, category);
      });

      li.appendChild(removeButton);
      ul.appendChild(li);
    });

    targetBucketList.appendChild(ul);
  });
}

// Funktion för att ta bort en aktivitet
function removeActivity(activityName, category) {
  activities = activities.filter((activity) => !(activity.name === activityName && activity.category === category));
  saveToLocalStorage(); // Uppdatera localStorage
  buildUl(); // Bygg om listan
}

// Lyssna på formulärets submit-händelse
targetForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Förhindra sidladdning

  // Hämta värden från formuläret
  const name = activityNameInput.value.trim();
  const category = activityCategorySelect.value;

  // Validera att namn inte är tomt
  if (name === '') {
    alert('Aktivitetens namn får inte vara tomt.');
    return;
  }

  // Lägg till aktivitet i listan och uppdatera gränssnittet
  activities.push({ name, category });
  buildUl();

  // Uppdatera localStorage
  saveToLocalStorage();

  // Töm formuläret
  activityNameInput.value = '';
  activityCategorySelect.value = 'Resor';
});

// Bygg listan vid sidladdning
buildUl();
