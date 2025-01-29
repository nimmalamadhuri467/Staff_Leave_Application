const root = document.getElementById('root');

// Sample data initialization (for demo)
if (!localStorage.getItem('users')) {
  localStorage.setItem('users', JSON.stringify([
    //hod's details
    { username: 'csehod', password: '1234', role: 'hod', department: 'Computer Science', designation: 'Head of Department' },
    { username: 'ecehod', password: '1234', role: 'hod', department: 'Electronics and Communication', designation: 'Head of Department' },
    { username: 'ithod', password: '1234', role: 'hod', department: 'Information Technology', designation: 'Head of Department' },
    {username: 'eeehod', password: '1234', role: 'hod', department: 'Electrical and Electronics', designation: 'Head of Department'},
    {username: 'civilhod', password: '1234', role: 'hod', department: 'Civil', designation: 'Head of Department'},
    {username: 'aimlhod', password: '1234', role: 'hod', department: 'Artificial Intelligence and Machine Learning', designation: 'Head of Department'},
    //cs depatment faculties
    { username: 'sushma', password: '1234', role: 'faculty', department: 'Computer Science', designation: 'Professor', remainingLeaves: 12},
    { username: 'mahesh', password: '1234', role: 'faculty', department: 'Computer Science', designation: 'Professor', remainingLeaves: 12},
    { username: 'ramesh', password: '1234', role: 'faculty', department: 'Computer Science', designation: 'Asst Professor',remainingLeaves: 10},
    { username: 'anjali', password: '1234', role: 'faculty', department: 'Computer Science', designation: 'Asst Professor',remainingLeaves: 10},
    { username: 'akram', password: '1234', role: 'faculty', department: 'Computer Science', designation: 'Technician', remainingLeaves: 8},
    //ece dept faculties
    { username: 'ankit', password: '1234', role: 'faculty', department: 'Electronics and Communication', designation: 'Asst Professor', remainingLeaves: 10},
    { username: 'priya', password: '1234', role: 'faculty', department: 'Electronics and Communication', designation: 'Professor', remainingLeaves: 12},
    { username: 'abdul', password: '1234', role: 'faculty', department: 'Electronics and Communication', designation: 'Technician', remainingLeaves: 8},
    { username: 'mery', password: '1234', role: 'faculty', department: 'Electronics and Communication', designation: 'Asst Professor', remainingLeaves: 10},
    //it dept faculties
    { username: 'rahim', password: '1234', role: 'faculty', department: 'Information Technology', designation: 'Professor', remainingLeaves: 12 },
    { username: 'laxmi', password: '1234', role: 'faculty', department: 'Information Technology', designation: 'Asst Professor', remainingLeaves: 10 },
    { username: 'swapna', password: '1234', role: 'faculty', department: 'Information Technology', designation: 'Technician', remainingLeaves: 8},
    { username: 'rishi', password: '1234', role: 'faculty', department: 'Information Technology', designation: 'Asst Professor', remainingLeaves: 10},
    //eee dept faculties 
    {username: 'anuradha', password: '1234', role: 'faculty', department: 'Electrical and Electronics', designation: 'Professor',remainingLeaves:12},
    {username: 'sathya', password: '1234', role: 'faculty', department: 'Electrical and Electronics', designation: 'Asst Professor',remainingLeaves:10},
    {username: 'sravan', password: '1234', role: 'faculty', department: 'Electrical and Electronics', designation: 'Asst professor',remainingLeaves:10},
    {username: 'meera', password: '1234', role: 'faculty', department: 'Electrical and Electronics', designation: 'Technician',remainingLeaves:8},
    
  ]));
  localStorage.setItem('leaves', JSON.stringify([]));
}

let currentUser = null;
let activeSection = 'home'; // Tracks the active section
let selectedLeaveDates = []; // Store selected leave dates

// The render function updates the UI based on the current user role and active section
const render = () => {
  if (!currentUser) {
    root.innerHTML = Login();  // Show login if user is not logged in
  } else if (currentUser.role === 'faculty') {
    root.innerHTML = FacultyDashboard();  // Show faculty dashboard if logged in as faculty
  } else if (currentUser.role === 'hod') {
    root.innerHTML = HodDashboard();  // Show HOD dashboard if logged in as HOD
  }
};

// Login Page
function Login() {
  return `
    <div class="container">
      <h1>Login</h1>
      <input type="text" id="username" placeholder="Username" />
      <input type="password" id="password" placeholder="Password" />
      <button onclick="handleLogin()">Login</button>
    </div>
  `;
}

function handleLogin() {
  const username = document.getElementById('username').value.trim();
  const password = document.getElementById('password').value.trim();
  const users = JSON.parse(localStorage.getItem('users'));

  const user = users.find(u => u.username === username && u.password === password);
  if (user) {
    currentUser = user;
    console.log("Login successful:", currentUser);
    render();  // Render the appropriate dashboard after login
  } else {
    alert('Invalid login');
  }
}

// Faculty Dashboard
function FacultyDashboard() {
  return `
    <div class="sidebar">
    <!-- Add an icon or image here -->
      <div class="icon-container">
      <img src="./images/profile1.png" alt="Faculty Icon" class="faculty-icon"  />
      </div>
      <a href="#" onclick="setActiveSection('applyLeave')">Apply Leave</a>
      <a href="#" onclick="setActiveSection('previousLeaves')">Previous Leaves</a>
      <a href="#" onclick="setActiveSection('settings')">Settings</a>
      <a href="#" onclick="logout()">Logout</a>
    </div>
    <div class="dashboard">${getFacultySection()}</div>
  `;
}
function getFacultySection() {
  const leaves = JSON.parse(localStorage.getItem('leaves')).filter(leave => leave.user === currentUser.username);

  switch (activeSection) {
    case 'applyLeave':
      return `
        <h2>Apply Leave</h2>
        <p><strong>Remaining Leaves:</strong> ${currentUser.remainingLeaves}</p>
        ${currentUser.remainingLeaves === 0 ? `
        <p>You have exhausted your regular leaves. You can apply for <strong>Unpaid Leave</strong>.</p>
        ` : ''}
        <div>
          <label>Select Leave Dates:</label>
          <input type="date" id="leaveDate" />
          <button onclick="addLeaveDate()">Add Date</button>
          <ul id="selectedDates"></ul>
        </div>
        <input type="text" id="leaveReason" placeholder="Reason for leave" />
        ${currentUser.remainingLeaves === 0 ? `
        <div>
          <input type="checkbox" id="unpaidLeaveCheckbox" />
          <label for="unpaidLeaveCheckbox">Apply for Unpaid Leave</label>
        </div>
        ` : ''}
        <div>
          <h3>Syllabus Status</h3>
          <p>Have you completed the syllabus for this semester?</p>
          <label for="syllabusStatus">Syllabus Status:</label>
          <select id="syllabusStatus">
            <option value="25%">25%</option>
            <option value="50%">50%</option>
            <option value=">=75%">≥75%</option>
            <option value="Completed">Completed</option>
          </select>
        </div>
        <button onclick="submitLeave()">Submit</button>
      `;
    case 'previousLeaves':
        return `
          <h2>Previous Leaves</h2>
          ${leaves.length > 0 ? `
            <ul>
              ${leaves.map(leave => `
                <li style="margin-bottom: 20px;">  <!-- Adds space between each leave -->
                  <table>
                    <tr>
                      <td><strong>Reason</strong></td>
                      <td>:${leave.reason}</td>
                    </tr>
                    <tr>
                      <td><strong>Dates</strong></td>
                      <td>:${leave.dates.join(', ')}</td>
                    </tr>
                    <tr>
                      <td><strong>Status</strong></td>
                      <td>:${leave.status}</td>
                    </tr>
                    ${leave.unpaidLeave ? `
                    <tr>
                      <td><strong>Type</strong></td>
                      <td>:Unpaid Leave</td>
                    </tr>` : ''}
                  </table>
                </li>
              `).join('')}
            </ul>
          ` : `<p>No previous leaves.</p>`}
      `;
      
      
    case 'settings': 
      return `
        <h2>Settings</h2>
        <label>Change Password</label>
        <input type="password" id="newPassword" placeholder="Enter new password" />
        <button onclick="changePassword()">Update Password</button>
      `;
    default:
      return `
        <h2>Welcome, ${currentUser.username}</h2>
        <p><strong>Department:</strong> ${currentUser.department}</p>
        <p><strong>Designation:</strong> ${currentUser.designation}</p>
        <p><strong>Remaining Leaves:</strong> ${currentUser.remainingLeaves}</p>
      `;
  }
}


// Updated submitLeave function to include syllabus status
function submitLeave() {
  const reason = document.getElementById('leaveReason').value.trim();
  const syllabusStatus = document.getElementById('syllabusStatus').value;
  const isUnpaidLeave = document.getElementById('unpaidLeaveCheckbox') ? document.getElementById('unpaidLeaveCheckbox').checked : false;

  if (selectedLeaveDates.length === 0) {
    alert('Please select at least one leave date.');
    return;
  }

  if (!reason) {
    alert('Please provide a reason for the leave.');
    return;
  }

  const newLeave = {
    user: currentUser.username,
    reason,
    dates: selectedLeaveDates,
    status: 'Pending',
    department: currentUser.department,
    designation: currentUser.designation,
    syllabusStatus: syllabusStatus,
    unpaidLeave: isUnpaidLeave // Add unpaid leave flag
  };

  const leaves = JSON.parse(localStorage.getItem('leaves'));
  leaves.push(newLeave);
  localStorage.setItem('leaves', JSON.stringify(leaves));

  alert(`Leave submitted successfully!${isUnpaidLeave ? ' (Unpaid Leave)' : ''}`);
  notifyHOD(currentUser.department); // Notify respective HOD
  selectedLeaveDates = []; // Reset the selected dates after submission
  setActiveSection('previousLeaves');
}


function setActiveSection(section) {
  activeSection = section;
  render();  // Re-render the view when the section changes
}

// Store selected leave dates in an array
function addLeaveDate() {
  const leaveDate = document.getElementById('leaveDate').value;
  if (!leaveDate) {
    alert("Please select a valid date.");
    return;
  }

  if (!selectedLeaveDates.includes(leaveDate)) {
    selectedLeaveDates.push(leaveDate);
    renderSelectedDates();
  } else {
    alert("This date is already selected.");
  }
}

function renderSelectedDates() {
  const selectedDatesElement = document.getElementById('selectedDates');
  selectedDatesElement.innerHTML = selectedLeaveDates
    .map(date => `<li>${date} <button onclick="removeLeaveDate('${date}')">Remove</button></li>`)
    .join('');
}

function removeLeaveDate(date) {
  selectedLeaveDates = selectedLeaveDates.filter(d => d !== date);
  renderSelectedDates();
}

function notifyHOD(department) {
  const users = JSON.parse(localStorage.getItem('users'));
  const hod = users.find(user => user.role === 'hod' && user.department === department);

  if (hod) {
    alert(`Notification sent to HOD of ${department}: ${hod.username}`);
  } else {
    alert('HOD for the department not found.');
  }
}

// Function to change password
function changePassword() {
  const newPassword = document.getElementById('newPassword').value.trim();
  if (newPassword.length < 4) {
    alert('Password should be at least 4 characters long.');
    return;
  }
  if (!newPassword) {
    alert('Please enter a new password.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users'));
  const updatedUsers = users.map(user => {
    if (user.username === currentUser.username) {
      return { ...user, password: newPassword }; 
    }
    return user;
  });

  localStorage.setItem('users', JSON.stringify(updatedUsers));
  alert('Password updated successfully.');
}
function logout() {
  // Clear the current user session (or token, if any)
  localStorage.removeItem('currentUser');
  // Redirect to login page
  alert('You have been logged out.');
  location.reload();  // Assuming the login view will be re-rendered after reload
}

// HOD Dashboard
function HodDashboard() {
  return `
    <div class="sidebar">
      <!-- Add an icon or image here -->
      <div class="icon-container">
      <img src="./images/profile1.png" alt="Hod Icon" class="hod-icon"  />
      </div>
      <a href="#" onclick="setActiveSection('recentLeaveRequests')">Recent Leave Requests</a>
      <a href="#" onclick="setActiveSection('facultyDetails')">Faculty Details</a>
      <a href="#" onclick="setActiveSection('settings')">Settings</a>
      <a href="#" onclick="setActiveSection('changePassword')">Change Password</a> <!-- New Change Password Option -->
      <a href="#" onclick="logout()">Logout</a>
    </div>
    <div class="dashboard">${getHodSection()}</div>
  `;
}

// Approve or decline leave functions
function approveLeave(username, dates) {
  const users = JSON.parse(localStorage.getItem('users'));
  const leaves = JSON.parse(localStorage.getItem('leaves'));

  const leaveToApprove = leaves.find(leave => leave.user === username && leave.dates.join(',') === dates);

  if (leaveToApprove) {
    // Update leave status to 'Approved'
    leaveToApprove.status = 'Approved';

    if (!leaveToApprove.unpaidLeave) {
      // Calculate the number of leave days
      const numOfLeaveDays = leaveToApprove.dates.length;

      // Find the user who requested the leave
      const user = users.find(u => u.username === username);

      if (user && user.remainingLeaves >= numOfLeaveDays) {
        // Deduct the leave days from remaining leaves for regular leaves
        user.remainingLeaves -= numOfLeaveDays;
      } else {
        alert('Insufficient remaining leaves.');
        return;
      }
    }

    // Save updated user data
    localStorage.setItem('users', JSON.stringify(users));
    
    // Save updated leave data
    localStorage.setItem('leaves', JSON.stringify(leaves));

    alert(`Leave approved! ${leaveToApprove.unpaidLeave ? '(Unpaid Leave)' : ''}`);
    render(); // Re-render the view to update the buttons and remaining leaves
  }
}


function declineLeave(username, dates) {
  const leaves = JSON.parse(localStorage.getItem('leaves')).map(leave => {
    if (leave.user === username && leave.dates.join(',') === dates) {
      return { ...leave, status: 'Declined' };
    }
    return leave;
  });
  localStorage.setItem('leaves', JSON.stringify(leaves));
  render(); // Re-render the view to update the buttons
}

// HOD Dashboard section
function getHodSection() {
  switch (activeSection) {
    case 'recentLeaveRequests':
      const leaves = JSON.parse(localStorage.getItem('leaves')).filter(leave => leave.department === currentUser.department);
      return `
        <h2>Recent Leave Requests</h2>
        ${leaves.length > 0 ? `
          <ul>
            ${leaves.map(leave => `
              <li style="margin-bottom: 20px;">
                <table>
                  <tr>
                    <td><strong>Faculty</strong></td>
                    <td>:${leave.user} (${leave.designation})</td>
                  </tr>
                  <tr>
                    <td><strong>Dates</strong></td>
                    <td>:${leave.dates.join(', ')}</td>
                  </tr>
                  <tr>
                    <td><strong>Reason</strong></td>
                    <td>:${leave.reason}</td>
                  </tr>
                  <tr>
                    <td><strong>Syllabus Status</strong></td>
                    <td>:${leave.syllabusStatus}</td>
                  </tr>
                  ${leave.unpaidLeave ? `
                    <tr>
                      <td><strong>Type</strong></td>
                      <td>:Unpaid Leave</td>
                    </tr>
                  ` : ''}
                  <tr>
                    <td><strong>Status</strong></td>
                    <td>:${leave.status}</td>
                  </tr>
                </table>
                ${leave.status === 'Pending' ? `
                  <button onclick="approveLeave('${leave.user}', '${leave.dates.join(',')}')">Approve</button>
                  <button onclick="declineLeave('${leave.user}', '${leave.dates.join(',')}')">Decline</button>
                ` : `<span>${leave.status}</span>`}
              </li>
            `).join('')}
          </ul>
        ` : `<p>No recent leave requests.</p>`}
      `;
  

    case 'facultyDetails':
      let users = JSON.parse(localStorage.getItem('users')).filter(user => user.department === currentUser.department && user.role === 'faculty');

      // Define the custom sort order for designations
      const designationOrder = {
        'professor': 1,
        'asst professor': 2,
        'technician': 3
      };

      // Sort the users array based on the designation order
      users.sort((a, b) => {
        const rankA = designationOrder[a.designation.toLowerCase()] || 4;
        const rankB = designationOrder[b.designation.toLowerCase()] || 4;
        return rankA - rankB;
      });

      // Add a search input and button
      return `
        <h2>Faculty Details</h2>
        <div>
          <input type="text" id="facultySearchInput" placeholder="Search by Name" oninput="filterFaculty()" />
          <button onclick="filterFaculty()">Search</button>
        </div>
        <div id="facultyTable">
          ${getFacultyTable(users)}
        </div>
      `;

    case 'settings':
      return `
        <h2>Settings</h2>
        <label>Add New Faculty</label>
        <input type="text" id="newFacultyName" placeholder="Faculty Name" />
        <input type="text" id="newFacultyDesignation" placeholder="Faculty Designation" />
        <input type="password" id="newFacultyPassword" placeholder="Assign Password" />
        <label>Assign Remaining Leaves</label>
        <input type="number" id="newFacultyLeaves" placeholder="Remaining Leaves (Professor: 12,asstprofessor:10,technician:8)" min="1" />
        <button onclick="addNewFaculty()">Add Faculty</button>
      `;
    
    case 'changePassword': 
      return `
        <h2>Change Password</h2>
        <label>Enter New Password</label>
        <input type="password" id="hodNewPassword" placeholder="New Password" />
        <button onclick="changeHodPassword()">Update Password</button>
      `;

    default:
      return `
        <h2>Welcome, ${currentUser.username}</h2>`;
  }
}

// Function to create the faculty table HTML
function getFacultyTable(users) {
  if (users.length > 0) {
    return `
      <table class="faculty-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Designation</th>
            <th>Department</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.username}</td>
              <td>${user.designation}</td>
              <td>${user.department}</td>
              <td>${user.username}@university.com</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;
  } else {
    return `<p>No faculty members found.</p>`;
  }
}

// Function to filter faculty members by name
function filterFaculty() {
  const searchTerm = document.getElementById('facultySearchInput').value.toLowerCase();
  let users = JSON.parse(localStorage.getItem('users')).filter(user => user.department === currentUser.department && user.role === 'faculty');

  // Filter users based on the search term
  users = users.filter(user => user.username.toLowerCase().includes(searchTerm));

  // Update the table content
  document.getElementById('facultyTable').innerHTML = getFacultyTable(users);
}

    

function addNewFaculty() {
  const name = document.getElementById('newFacultyName').value.trim();
  const designation = document.getElementById('newFacultyDesignation').value.trim();
  const password = document.getElementById('newFacultyPassword').value.trim();
  const remainingLeaves = document.getElementById('newFacultyLeaves').value.trim();

  if (!name || !designation || !password) {
    alert('Please fill all the fields.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users'));
  const newFaculty = {
    username: name,
    password: password,
    role: 'faculty',
    department: currentUser.department,
    designation: designation,
    remainingLeaves: remainingLeaves ? parseInt(remainingLeaves, 10) : 12 // Use the input value or default to 12
  };

  users.push(newFaculty);
  localStorage.setItem('users', JSON.stringify(users));

  alert('New faculty added successfully!');
}


function changeHodPassword() {
  const newPassword = document.getElementById('hodNewPassword').value.trim();
  if (newPassword.length < 4) {
    alert('Password should be at least 4 characters long.');
    return;
  }
  if (!newPassword) {
    alert('Please enter a new password.');
    return;
  }

  const users = JSON.parse(localStorage.getItem('users'));
  const updatedUsers = users.map(user => {
    if (user.username === currentUser.username) {
      return { ...user, password: newPassword }; 
    }
    return user;
  });

  localStorage.setItem('users', JSON.stringify(updatedUsers));
  alert('Password updated successfully.');
}
function logout() {
  localStorage.removeItem('currentUser');
  alert('You have been logged out.')
  location.reload();
}

// Initial render call when the page loads
render();