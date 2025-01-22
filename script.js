// Hämta element från DOM
const targetForm = document.getElementById('bucketForm'); // Formuläret
const activityNameInput = document.getElementById('activityName'); // Input för aktivitetens namn
const activityCategorySelect = document.getElementById('activityCategory'); // Select för kategori
const targetBucketList = document.getElementById('bucketLists'); // Sektion för listan

// Ladda aktiviteter från LS (eller tom array om det inte finns något)
let activities = JSON.parse(localStorage.getItem('activities')) || [];

// Funktion för att uppdatera LS
const saveToLocalStorage = () => {
    localStorage.setItem('activities', JSON.stringify(activities));
};

// Funktion för att bygga och rendera listan, sorterad efter kategori
const buildUl = () => {
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
        // Skapa UL
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

                console.log(activity.activityStatus);

                // Växla klass
                if (activity.activityStatus === true) {
                    liEl.classList.toggle('activity-done');
                }
                // Mall för <li> elementen (@majazocom)
                liEl.innerHTML = `
                    <p>${activity.name}</p>
                    <label></label>
                    <input type="checkbox" class="activity-checkbox">
                    <button class="action">
                    <span class="material-symbols-outlined">Delete</span></button>
                    `;

                // Kalla på funktionen för att ta bort aktivitet
                const removeButton = liEl.querySelector('.action');
                removeButton.addEventListener('click', () => {
                    removeActivity(activity.name, activity.category);
                });

                // Kalla på funktionen för att ändra status done/undone
                const activityDoneEl = liEl.querySelector('.activity-checkbox'); //
                activityDoneEl.addEventListener('change', (ev) => {
                    changeActivityStatus(ev.target);
                });

                ul.appendChild(liEl);
            });

        targetBucketList.appendChild(ul);
    });
};

const changeActivityStatus = (target) => {
    // Get the parent element
    const parentElement = target.parentElement; // Returns the parent element (if it's an element node)
    const pTag = parentElement.querySelector('p'); // Find the <p> tag inside the parent
    const textValue = pTag.textContent; // Get the text content of the <p> tag
    // console.log(textValue);

    // Find the object to update (e.g., update 'banana' to 'orange')
    const objectIndex = activities.findIndex((obj) => obj.name === textValue);
    if (objectIndex !== -1) {
        activities[objectIndex].activityStatus = !activities[objectIndex].activityStatus;
    }
    buildUl(); // Bygg (om) listan
    saveToLocalStorage(); // Spara till LS
};

const removeActivity = (activityName, category) => {
    activities = activities.filter((activity) => !(activity.name === activityName && activity.category === category));
    buildUl(); // Bygg (om) listan
    saveToLocalStorage(); // Spara till LS
};

// Lyssna på formulärets submit-händelse
targetForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Förhindra sidladdning

    // Hämta värden från formuläret
    const name = activityNameInput.value.trim();
    const category = activityCategorySelect.value;
    const activityStatus = false; //initialt är alla activitys ogjorda

    // Lägg till aktivitet i listan och uppdatera gränssnittet
    activities.push({ name, category, activityStatus });

    buildUl(); // Bygg (om) listan
    saveToLocalStorage(); // Spara till LS

    // Töm formuläret
    activityNameInput.value = '';
    activityCategorySelect.value = 'Resor';
});

// Låt oss välja tema mellan light/dark
const swapTheme = () => {
    const toggleThemeBtn = document.getElementById('toggle');
    const bodyEl = document.body;
    // Initisiera currentTheme från LS
    const currentTheme = localStorage.getItem('theme') || 'light';
    bodyEl.setAttribute('data-theme', currentTheme); // Vi sätter

    // Växla tema
    toggleThemeBtn.addEventListener('click', (event) => {
        event.preventDefault();
        toggleThemeBtn.classList.toggle('on');
        const currentTheme = bodyEl.getAttribute('data-theme');
        const newTheme = currentTheme === 'light' ? 'dark' : 'light';
        bodyEl.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme); // Spara till LS
    });
};

const initApp = () => {
    buildUl(); // Bygg listan
    swapTheme(); // Välj tema
};
initApp();
