const attendanceList = document.getElementById('attendanceList');

async function markAttendance() {
    const studentName = document.getElementById('studentName').value;
    if (studentName === '') {
        alert('Please enter a student name');
        return;
    }
    const response = await fetch('http://localhost:3000/markAttendance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: studentName })
    });
    
    if (response.ok) {
        alert('Attendance marked!');
        loadAttendance();
    } else {
        alert('Error marking attendance');
    }
}

async function loadAttendance() {
    const response = await fetch('/getAttendance');
    const data = await response.json();

    attendanceList.innerHTML = '';
    data.forEach(student => {
        const li = document.createElement('li');
        li.textContent = student.name;
        attendanceList.appendChild(li);
    });
}

// Load attendance when the page is loaded
window.onload = loadAttendance;
