/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import Swal from 'sweetalert2';

// Mock Swal
jest.mock('sweetalert2', () => ({
  fire: jest.fn()
}));

// Global CSRF token for mocks
global.csrftoken = 'fake-csrf-token';

document.body.innerHTML = `
  <div class="card">
    <div id="regular-upload-101" style="display: none;"></div>
    <div id="resit-grades-upload-101" style="display: none;"></div>
    <div id="resit-upload-101" style="display: none;"></div>
    <form id="resit-form-101" action="/exams/upload_grades/101/">
      <input type="hidden" name="csrfmiddlewaretoken" value="fake-csrf-token">
      <input type="file" name="grade_file">
    </form>
  </div>
  <input type="file" id="inputGroupFile04_101">
  <input type="file" id="inputGroupFileResit_101">
  <input type="file" id="resitInputFile_101">
`;

function toggleUpload(button, type, courseId) {
  const card = button.closest('.card');
  const regularUpload = card.querySelector(`#regular-upload-${courseId}`);
  const resitGradesUpload = card.querySelector(`#resit-grades-upload-${courseId}`);
  const resitUpload = card.querySelector(`#resit-upload-${courseId}`);

  regularUpload.style.display = 'none';
  resitGradesUpload.style.display = 'none';
  resitUpload.style.display = 'none';

  if (type === 'resit') {
    resitUpload.style.display = 'block';
  } else if (type === 'resit_grades') {
    resitGradesUpload.style.display = 'block';
  } else if (type === 'regular') {
    regularUpload.style.display = 'block';
  }
}

describe('toggleUpload', () => {
  test('shows correct upload section for resit', () => {
    const button = document.createElement('button');
    const card = document.querySelector('.card');
    card.appendChild(button);

    toggleUpload(button, 'resit', '101');

    expect(document.getElementById('resit-upload-101')).toHaveStyle('display: block');
    expect(document.getElementById('resit-grades-upload-101')).toHaveStyle('display: none');
    expect(document.getElementById('regular-upload-101')).toHaveStyle('display: none');
  });

  test('shows correct upload section for regular', () => {
    const button = document.createElement('button');
    const card = document.querySelector('.card');
    card.appendChild(button);

    toggleUpload(button, 'regular', '101');

    expect(document.getElementById('regular-upload-101')).toHaveStyle('display: block');
    expect(document.getElementById('resit-upload-101')).toHaveStyle('display: none');
  });
});

describe('uploadExcel', () => {
  beforeEach(() => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve({ status: 'success' }),
      })
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('warns if no file is selected', async () => {
    const input = document.getElementById('inputGroupFile04_101');
    input.value = ''; // Simulate no file

    const uploadExcel = (courseId, isResit = false) => {
      const fileInput = document.getElementById(isResit ? `inputGroupFileResit_${courseId}` : `inputGroupFile04_${courseId}`);
      if (!fileInput.files.length) {
        Swal.fire({
          icon: "warning",
          title: "No file selected",
          text: "Please select an Excel file before uploading.",
        });
        return;
      }
    };

    uploadExcel('101');
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({
      icon: "warning",
      title: "No file selected"
    }));
  });
});
