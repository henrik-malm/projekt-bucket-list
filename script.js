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
    acc[category].push(activity);
    return acc;
  }, {});

  // Sortera kategorierna i bokstavsordning
  const sortedCategories = Object.keys(groupedActivities).sort();

  // Bygg <ul> per kategori
  sortedCategories.forEach((category) => {
    const ul = document.createElement('ul');
    const categoryHeader = document.createElement('h3');
    categoryHeader.classList.add('category-title');
    categoryHeader.textContent = category;

    ul.appendChild(categoryHeader);

    // Sortera aktiviteter inom kategorin
    groupedActivities[category]
      .sort((a, b) => a.name.localeCompare(b.name))
      .forEach((activity) => {
        const liEl = document.createElement('li');

        // Add a class if taskStatus is true
        if (activity.taskStatus === true) {
          liEl.classList.add('task-done');
        }

        liEl.innerHTML = `
        <p>${activity.name}</p>
        <input type="checkbox" class="task-done">
        <button class="action">
        <span class="material-symbols-outlined">Delete</span></button>
        `;

        // //Skapa en P tagg
        // const p = document.createElement('p');
        // p.textContent = activity.name;

        // Lägg till en ta bort-knapp för varje aktivitet
        // const removeButton = document.createElement('button');
        // removeButton.classList.add('action');

        // Skapa <span> för ikon
        const removeIcon = document.createElement('span');
        // removeIcon.classList.add('material-symbols-outlined');
        // removeIcon.textContent = 'Delete';

        // Lägg till <span>
        // removeButton.appendChild(removeIcon);

        // Skapa checkbox för task done
        // const taskDoneEl = document.createElement('input');
        // taskDoneEl.type = 'checkbox';
        // taskDoneEl.checked = activity.taskStatus; // Set checkbox based on taskStatus
        // taskDoneEl.id = 'taskDone';

        // Kalla på funktionen för att ta bort aktivitet

        // Add the event listener to the button after inserting the HTML
        const removeButton = liEl.querySelector('.action'); // Target the button
        removeButton.addEventListener('click', () => {
          removeActivity(activity.name, activity.category);
        });

        // Kalla på funktionen för att ändra status done/undone
        const taskDoneEl = liEl.querySelector('.task-done'); // Target the button

        taskDoneEl.addEventListener('change', (ev) => {
          changeTaskStatus(ev.target);
          buildUl(); // Rebuild the list to update the class
        });

        // liEl.appendChild(p);
        // liEl.appendChild(taskDoneEl);
        // liEl.appendChild(removeButton);

        ul.appendChild(liEl);
      });

    targetBucketList.appendChild(ul);
  });
}

function changeTaskStatus(target) {
  // target.classList.toggle('hello');
  // Är vårt target element "checked"?
  if (target.checked) {
    console.log('checked');
    console.log(target);
  } else {
    console.log('not checcked');
  }

  // Get the parent element
  const parentElement = target.parentElement; // Returns the parent element (if it's an element node)

  const compareWithMe = parentElement.firstChild.textContent.trim();
  // Find the object to update (e.g., update 'banana' to 'orange')
  const objectIndex = activities.findIndex((obj) => obj.name === compareWithMe);
  if (objectIndex !== -1) {
    activities[objectIndex].taskStatus = !activities[objectIndex].taskStatus;
  }

  saveToLocalStorage();
}

// Funktion för att ta bort en aktivitet --> FILTER!!!
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
  const taskStatus = false; //initialt är alla tasks ogjorda

  // console.log(taskStatus + 'he');

  // Lägg till aktivitet i listan och uppdatera gränssnittet
  activities.push({ name, category, taskStatus });
  buildUl();

  // Uppdatera localStorage
  saveToLocalStorage();

  // Töm formuläret
  activityNameInput.value = '';
  activityCategorySelect.value = 'Resor';
});

// Låt oss ändra tema {}
const toggleThemeBtn = document.getElementById('toggle');
const body = document.body;

// Initisiera tema från LS
const currentTheme = localStorage.getItem('theme') || 'light';
body.setAttribute('data-theme', currentTheme);

// Toggle theme on button click
toggleThemeBtn.addEventListener('click', (event) => {
  event.preventDefault(); // Prevents the link from navigating
  toggleThemeBtn.classList.toggle('on');
  const currentTheme = body.getAttribute('data-theme');
  const newTheme = currentTheme === 'light' ? 'dark' : 'light';
  body.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme); // Save preference to localStorage
});

// Bygg listan
buildUl();
