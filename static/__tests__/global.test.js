/**
 * @jest-environment jsdom
 */

const { fireEvent } = require("@testing-library/dom");

// Mocks
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ status: "success" }),
  })
);

function getCookie(name) {
  return "mocked-csrf-token";
}

global.getCookie = getCookie;
global.showSuccess = jest.fn();
global.showError = jest.fn();
global.alert = jest.fn();

// Setup DOM
document.body.innerHTML = `
  <input id="announcementTitle" value="Test Title"/>
  <textarea id="announcementText">Test Text</textarea>
  <button class="publish">Publish</button>

  <input type="file" id="scheduleFile"/>
  <span id="filePreview"></span>
  <div id="confirmationMsg"></div>
  <input name="csrfmiddlewaretoken" value="test-token"/>
  <main data-upload-url="/upload"></main>

  <select id="allStudentsCourseSelect"><option value=""></option></select>
  <table id="allStudentsTable">
    <tbody>
      <tr><td>Row</td></tr>
    </tbody>
  </table>
`;

// Import your functions here
const {
  postAnnouncement,
  uploadFile,
  deleteStudent,
  resetAllStudentsTable
} = require("../js/global"); // adjust path if needed

describe("postAnnouncement", () => {
  it("submits announcement and clears fields", async () => {
    await postAnnouncement(); // must await since it uses fetch
    expect(fetch).toHaveBeenCalledWith("/courses/post_announcement/", expect.any(Object));
    expect(document.getElementById("announcementTitle").value).toBe("");
    expect(document.getElementById("announcementText").value).toBe("");
    expect(showSuccess).toHaveBeenCalledWith("Announcement posted!");
  });
});

const { waitFor } = require("@testing-library/dom");

describe("uploadFile", () => {
  beforeEach(() => {
    // Reset DOM state before each test
    document.getElementById("scheduleFile").value = "";
    document.getElementById("filePreview").textContent = "";
    document.getElementById("confirmationMsg").innerHTML = "";
  });

  it("shows error if no file selected", () => {
    // Simulate no file selection
    Object.defineProperty(document.getElementById("scheduleFile"), "files", {
      value: [],
      writable: true,
    });

    uploadFile();

    expect(document.getElementById("confirmationMsg").innerHTML)
      .toMatch(/Please select a file/i);
  });

  it("uploads file and shows success message", async () => {
    const fileInput = document.getElementById("scheduleFile");
    const file = new File(["dummy content"], "test.xlsx", {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    });

    Object.defineProperty(fileInput, "files", {
      value: [file],
      writable: true,
    });

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ status: "success" }),
      })
    );

    await uploadFile();

    expect(fetch).toHaveBeenCalled();

    await waitFor(() => {
      expect(document.getElementById("confirmationMsg").innerHTML)
        .toMatch(/File uploaded and processed successfully!/i);
    });
  });
});



describe("deleteStudent", () => {
  beforeEach(() => {
    global.Swal = {
      fire: jest.fn(() => Promise.resolve({ isConfirmed: true }))
    };
    global.csrftoken = "mocked-csrf";
  });

  it("deletes student and removes row", async () => {
    const button = document.createElement("button");
    const tr = document.createElement("tr");
    tr.appendChild(button);
    document.body.appendChild(tr);

    await deleteStudent(1, button);

    expect(fetch).toHaveBeenCalledWith("/exams/delete_grade/", expect.any(Object));
    expect(showSuccess).toHaveBeenCalled();
  });
});

describe("resetAllStudentsTable", () => {
  it("resets filter and shows all rows", () => {
    const select = document.getElementById("allStudentsCourseSelect");
    select.value = "math"; // simulate a filtered state

    const row = document.querySelector("#allStudentsTable tbody tr");
    row.style.display = "none";

    resetAllStudentsTable();

    expect(select.value).toBe("");
    expect(row.style.display).toBe("");
  });
});
