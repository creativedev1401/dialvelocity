function loginUser() {
    // Assuming successful login
    localStorage.setItem('isLoggedIn', 'true');
    // Redirect to appropriate page after login
}

function logoutUser() {
    localStorage.setItem('isLoggedIn', 'false');
    // Redirect to home or login page
}
// Function to save users to the JSON file on the server
function saveUsers(users) {
    fetch('http://localhost:3000/save-users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(users)
    })
    .then(response => response.text())
    .then(data => console.log(data))
    .catch(error => console.error('Error:', error));
}

// Function to load users from the JSON file on the server
function loadUsers(callback) {
    fetch('http://localhost:3000/load-users')
    .then(response => response.json())
    .then(data => callback(data))
    .catch(error => console.error('Error:', error));
}

// Function to handle login
function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    loadUsers((users) => {
        if (users[email] && users[email] === password) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('loggedInUser', email);
            window.location.href = 'newpage.html';
        } else {
            alert('Incorrect email or password');
        }
    });
}

// Function to handle signup
function handleSignup(event) {
    event.preventDefault();
    const email = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password === confirmPassword) {
        loadUsers((users) => {
            users[email] = password;
            saveUsers(users);
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('loggedInUser', email);
            window.location.href = 'newpage.html';
        });
    } else {
        alert('Passwords do not match');
    }
}

// Function to handle sign out
function handleSignOut() {
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('loggedInUser');
    window.location.href = 'login.html';
}

// Check if the user is logged in
function checkLoginStatus() {
    const loggedIn = localStorage.getItem('loggedIn');
    const loginBtn = document.getElementById('login-btn');
    const signupBtn = document.getElementById('signup-btn');
    const signOutBtn = document.getElementById('sign-out-btn');
    
    if (loggedIn === 'true') {
        if (loginBtn) loginBtn.style.display = 'none';
        if (signupBtn) signupBtn.style.display = 'none';
        if (signOutBtn) signOutBtn.style.display = 'block';
    } else {
        if (signOutBtn) signOutBtn.style.display = 'none';
    }
}

//START OF IPM_SCRIPT FUNCTIONS
// Fetch the menu data from the JSON file
async function fetchMenuData() {
    try {
        const response = await fetch('/menuData');
        menuData = await response.json();
        renderMenu(menuData.main); // Ensure all options are loaded
    } catch (error) {
        console.error('Error loading menu data:', error);
    }
}

// Save the updated menu data to the backend
async function saveMenuData() {
    try {
        const response = await fetch('/saveMenuData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(menuData),
        });

        if (!response.ok) {
            throw new Error('Failed to save menu data');
        }

        console.log('Menu data saved successfully');
    } catch (error) {
        console.error('Error saving menu data:', error);
    }
}
//END OF IPM_SCRIPT FUNCTIONS

//START OF EDITMENU MODAL FUNCTIONS
// Assuming you have the renderMenu function already
// function renderMenu(menuData) {
//     const menuGrid = document.getElementById('menuGrid');

//     // Clear the grid before rendering new items
//     menuGrid.innerHTML = '';

//     // Iterate over the menu items and create the HTML structure
//     for (const menuItem of menuData) {
//         const menuBox = document.createElement('div');
//         menuBox.classList.add('menu-box');

//         // Create the content for the menu box
//         const menuContent = document.createElement('p');
//         menuContent.textContent = `${menuItem.name}: ${menuItem.number}`;
//         menuBox.appendChild(menuContent);

//         // Create the edit button
//         const editButton = document.createElement('img');
//         editButton.src = 'https://w7.pngwing.com/pngs/245/890/png-transparent-computer-icons-writing-editing-write-miscellaneous-angle-pencil.png';
//         editButton.alt = 'Edit';
//         editButton.classList.add('edit-button');


//         console.log('is this shit even running');
//         // Attach click event to open modal
//         editButton.addEventListener('click', function () {
//             console.log('yay');
//             openModal(menuItem, menuBox);
//         });


//         // Append the edit button to the menu box
//         menuBox.appendChild(editButton);

//         // Append the menu box to the grid container
//         menuGrid.appendChild(menuBox);
//     }
// }

// // Function to open the modal and prefill with the selected item's data
// function openModal(menuItem, menuBox) {
//     const modal = document.getElementById('editModal');
//     const modalName = document.getElementById('modalName');
//     const modalNumber = document.getElementById('modalNumber');

//     // Prefill the modal with current data
//     modalName.value = menuItem.name;
//     modalNumber.value = menuItem.number;

//     // Show the modal
//     modal.style.display = "block";

//     // Handle save button click
//     document.getElementById('saveChanges').onclick = function () {
//         menuItem.name = modalName.value;
//         menuItem.number = modalNumber.value;
//         menuBox.querySelector('p').textContent = `${menuItem.name}: ${menuItem.number}`;
//         closeModal();
//     };

//     // Handle delete button click
//     document.getElementById('deleteItem').onclick = function () {
//         menuBox.remove();
//         // You might want to remove the item from the original data source as well
//         closeModal();
//     };
// }

// // Function to close the modal
// function closeModal() {
//     const modal = document.getElementById('editModal');
//     modal.style.display = "none";
// }

// //Open the model when the user clicks on the pencil
// document.querySelector('.modal-close').onclick = function () {
//     closeModal();
// }

// // Close the modal when the user clicks the 'x'
// document.querySelector('.modal-close').onclick = function () {
//     closeModal();
// }ß
// END OF EDITMENU MODAL FUNCTIONS

// Event listeners for form submissions
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    if (loginForm) loginForm.addEventListener('submit', handleLogin);

    const signupForm = document.getElementById('signup-form');
    if (signupForm) signupForm.addEventListener('submit', handleSignup);

    const signOutBtn = document.getElementById('sign-out-btn');
    if (signOutBtn) signOutBtn.addEventListener('click', handleSignOut);

    checkLoginStatus();
});


document.addEventListener('DOMContentLoaded', function() {
    const editOptionsPageBtn = document.querySelector('a[href="#edit-options-page"]');
    
    if (editOptionsPageBtn) {
        editOptionsPageBtn.addEventListener('click', function(event) {
            event.preventDefault();
            const isLoggedIn = localStorage.getItem('loggedIn') === 'true';

            if (isLoggedIn) {
                window.location.href = 'edit.html';
            } else {
                window.location.href = 'login.html';
            }
        });
    }
});

// document.addEventListener('DOMContentLoaded', async function() {
//     const menuGrid = document.getElementById('menuGrid');
//     // const userAccount = localStorage.getItem('loggedInUser')

//     try {
//         // Fetch the user.json data
//         const response = await fetch(`/menuData?accountName=${encodeURIComponent(localStorage.getItem('loggedInUser'))}`); // Adjust the path as necessary
//         const userMenus = await response.json();

//         // Loop through each menu object in the JSON
//         for (let menuName in userMenus) {
//             if (userMenus.hasOwnProperty(menuName) && userMenus[menuName].options) {
//                 const menu = userMenus[menuName];
                
//                 // Create a new box for each menu
//                 const box = document.createElement('a');
//                 box.href = `phoneMenu.html?menu=${encodeURIComponent(menuName)}`; // Add menuName as a query parameter
//                 box.className = 'menu-box';

//                 // Populate the box with the menu details
//                 box.innerHTML = `
//                     <div>Name: ${menuName}</div>
//                     <div>Link: ${menu.Link}</div>
//                     <div>Number: ${menu.Number}</div>
//                     <div class="edit-box" id="penBox" ><img src="https://w7.pngwing.com/pngs/245/890/png-transparent-computer-icons-writing-editing-write-miscellaneous-angle-pencil.png" alt="Edit" class="edit-button" id="pencilEdit"><p></p></div>
//                 `;

//                 // Append the box to the grid container
//                 menuGrid.appendChild(box);
//             }
//         }

//         document.querySelectorAll('edit-button').onclick = function () {
//             console.log('yay');
//         }
//     } catch (error) {
//         console.error('Error fetching or processing user.json:', error);
//     }
// });

//<div class="edit-box" id="penBox" ><img src="https://w7.pngwing.com/pngs/245/890/png-transparent-computer-icons-writing-editing-write-miscellaneous-angle-pencil.png" alt="Edit" class="edit-button" id="pencilEdit"><p></p></div>