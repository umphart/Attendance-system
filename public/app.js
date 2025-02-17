const attendanceList = document.getElementById('attendanceList');

// Show alert function
function showAlert(message, type) {
    const alertBox = document.createElement('div');
    alertBox.classList.add('alert', `alert-${type}`, 'mt-3');
    alertBox.role = 'alert';
    alertBox.textContent = message;
    
    document.querySelector('.container').prepend(alertBox);
    
    setTimeout(() => alertBox.remove(), 3000);
}

// Mark attendance
async function markAttendance() {
    const studentName = document.getElementById('studentName').value;
    if (studentName === '') {
        showAlert('Please enter a student name', 'danger');
        return;
    }

    const response = await fetch('http://localhost:3001/markAttendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: studentName })
    });

    if (response.ok) {
        showAlert('Attendance marked!', 'success');
        loadAttendance();
        document.getElementById('studentName').value = ''; // Clear input
    } else {
        showAlert('Error marking attendance', 'danger');
    }
}

// Load attendance
async function loadAttendance() {
    const response = await fetch('http://localhost:3001/getAttendance');
    const data = await response.json();
    
    attendanceList.innerHTML = '';
    data.forEach(student => {
        const li = document.createElement('li');
        li.textContent = student.name;
        li.classList.add('list-group-item');
        attendanceList.appendChild(li);
    });
}

// Generate QR Code
function generateQRCode() {
    const qrText = document.getElementById('qrText').value;
    if (qrText === '') {
        showAlert("Enter student name or ID", "warning");
        return;
    }
    
    document.getElementById('qrcode').innerHTML = ""; // Clear previous QR
    new QRCode(document.getElementById("qrcode"), qrText);
}

// Scan QR Code
async function startScan() {
    const scanner = new Instascan.Scanner({ video: document.getElementById('preview') });
    
    scanner.addListener('scan', function (content) {
        alert("Scanned: " + content);
        document.getElementById('studentName').value = content;
        markAttendance();
    });

    const cameras = await Instascan.Camera.getCameras();
    if (cameras.length > 0) {
        scanner.start(cameras[0]);
    } else {
        alert("No camera found.");
    }
}

// Load attendance on page load
window.onload = loadAttendance;
