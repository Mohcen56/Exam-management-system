function addStudent() {
    const email = document.getElementById('newEmail').value.trim();
    const name = document.getElementById('newName').value.trim();
    const program = document.getElementById('newProgram').value.trim();
  
    if (!email || !name || !program) {
      showError('Please fill in all fields and select years.');
      return;
    }
  
    const formData = new FormData();
    formData.append("email", email);
    formData.append("name", name);
    formData.append("program", program);
  
    fetch('/users/add_student/', {
      method: 'POST',
      headers: { 'X-CSRFToken': csrftoken },
      body: formData
    })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        const table = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
        const newRow = table.insertRow();
  
        newRow.innerHTML = `
          <td contenteditable="true">${data.email}</td>
          <td contenteditable="true">${name}</td>
          <td contenteditable="true">${program}</td>
          <td>${data.password}</td>
          <td><button onclick="deleteStudent('${data.email}', this)">Delete</button></td>
        `;
  
        showSuccess(`Student added!\nEmail: ${data.email}\nPassword: ${data.password}`);
        document.getElementById('newEmail').value = "";
        document.getElementById('newName').value = "";
        document.getElementById('newProgram').value = "";
      } else {
        showError(data.message);
      }
    })
    .catch(error => {
      console.error('Error adding student:', error);
      showError("Something went wrong.");
    });
  }
  

function uploadExcel() {
    const fileInput = document.getElementById("inputGroupFile04");
    if (!fileInput.files.length) {
      showError("Please select an Excel file.");
      return;
    }
  
    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
  
    fetch("/users/upload_excel_students/", {
      method: "POST",
      headers: { "X-CSRFToken": csrftoken },
      body: formData,
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === "success") {
        const table = document.getElementById('studentTable').getElementsByTagName('tbody')[0];
        data.students.forEach(student => {
          const row = table.insertRow();
          row.innerHTML = `
            <td contenteditable="true">${student.email}</td>
            <td contenteditable="true">${student.name}</td>
            <td contenteditable="true">${student.program}</td>
            <td>${student.password}</td>
            <td><button onclick="deleteStudent('${student.email}', this)">Delete</button></td>
          `;
        });
        showSuccess("Students uploaded successfully!");
        fileInput.value = "";
      } else {
        showError(data.message);
      }
    })
    .catch(err => {
      console.error(err);
      showError("Something went wrong uploading the file.");
    });
  }
  

  function deleteStudent(email, btn) {
    Swal.fire({
      title: "Are you sure?",
      text: "This student will be deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "Cancel"
    }).then(result => {
      if (!result.isConfirmed) return;
  
      const formData = new FormData();
      formData.append("email", email);
  
      fetch('/users/delete_student/', {
        method: 'POST',
        headers: { 'X-CSRFToken': csrftoken },
        body: formData
      })
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          btn.closest("tr").remove();
          showSuccess("Student deleted.");
        } else {
          showError(data.message);
        }
      })
      .catch(error => {
        console.error('Error deleting student:', error);
        showError("Something went wrong.");
      });
    });
  }
  

function applyResit(button) {
    const courseCode = button.dataset.courseCode;
  
    fetch('/exams/declare_resit/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        "X-CSRFToken": csrftoken,
      },
      body: new URLSearchParams({ 'course_code': courseCode.trim() })
    })
    .then(response => response.json())
    .then(data => {
      if (data.status === 'success') {
        showSuccess('Resit declaration successful!');
        button.disabled = true;
        button.innerText = "Applied!";
      } else {
        showError(data.message);
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showError("Something went wrong.");
    });
}
  

