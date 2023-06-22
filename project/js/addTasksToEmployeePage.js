let dailyReportTable = document.querySelector(".dailyReport tbody");
let monthlyReportTable = document.querySelector(".monthlyReport tbody");
var monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

getDailyReportFromServerAndDisplayIt();
getMonthlyReportFromServerAndDisplayIt();

async function fetchAllEmployee() {
  let AllEmployee = await fetch("http://localhost:3000/Employees");
  let AllEmployeeData = await AllEmployee.json();
  return AllEmployeeData;
}

async function getDailyReportFromServerAndDisplayIt() {
  let AllDailyReport = await fetch("http://localhost:3000/daily_report");
  let AllDailyReportData = await AllDailyReport.json();
  AllDailyReportData.forEach(async (dataemp) => {
    await addDailyReportToTable(dataemp);
  });
}

async function addDailyReportToTable(data) {
  dailyReportTable.innerHTML += `
    <tr>
    <td>${data.description}</td>
    <td>${data.date} At 11:59 PM</td>
    <td><button id="${data.id}"  class="btn btn-success" onclick=" ExcuseReport(this,'daily_report','full_reports')">UpLoad</button></td>
    <td><button id="${data.id}"  class="btn btn-warning" onclick=" ExcuseReport(this,'daily_report','excuse_reports')">Excuse</button></td>
</tr>
    `;
}

async function getMonthlyReportFromServerAndDisplayIt() {
  let AllMonthlyReport = await fetch("http://localhost:3000/monthly_report");
  let AllMonthlyReportData = await AllMonthlyReport.json();
  AllMonthlyReportData.forEach(async (dataemp) => {
    await addMonthlyReportToTable(dataemp);
  });
}

async function addMonthlyReportToTable(data) {
  monthlyReportTable.innerHTML += `
    <tr>
    <td>${data.description}</td>
    <td>28 of ${monthNames[data.date]} at 11:59 PM</td>
    <td><button id="${
      data.id
    }" class="btn btn-success" onclick=" ExcuseReport( this,'monthly_report','full_reports')">UpLoad</button></td>
    <td><button id="${
      data.id
    }" class="btn btn-warning" onclick=" ExcuseReport( this,'monthly_report','excuse_reports')">Excuse</button></td>
   
    </tr>
    `;
}
async function preventClickBehavior() {
  let btns = await document.querySelectorAll("button");
  btns.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
    });
  });
}
///////////// start report classification for user
var excuse;
var reportID;
var specifiedReportDate;
let id = localStorage.getItem("userId");

async function ExcuseReport(btn, categoryReport, reportState) {
  await preventClickBehavior();
  let reoprt = await fetch(`http://localhost:3000/${categoryReport}/${btn.id}`);
  let reportData = await reoprt.json();
  excuse = await (reportData.description + reportData.date);
  reportID = await reportData.id;
  specifiedReportDate = await reportData.date;

  if (reportState === "excuse_reports") {
    //////////////////// check report full or no
    if (!(await checkDataIntoFullReport())) {
      await updateDataAfterExcuse(reportState);
      btn.parentNode.parentNode.classList.add("excused");
    }
  }
  if (reportState === "full_reports") {
    btn.parentNode.parentNode.classList.add("full");
    await updateDataAfterUpload(reportState);
    if (await getDateForReport(categoryReport)) {
      await updateLateReport("late_reports");
    }
  }
}

async function updateDataAfterUpload(reportState) {
  full_reports = await addreportToEmpData(reportState);
  console.log(id);
  await fetch(`http://localhost:3000/Employees/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      full_reports,
    }),
  });
}

async function updateDataAfterExcuse(reportState) {
  excuse_reports = await addreportToEmpData(reportState);
  await fetch(`http://localhost:3000/Employees/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      excuse_reports,
    }),
  });
}

async function addreportToEmpData(stateReport) {
  let response = await fetch(`http://localhost:3000/Employees/${id}`);
  let employee = await response.json();
  reports = employee[stateReport] || [];
  if (reports.length > 0) {
    if (!reports.some((data) => data.report_name === excuse)) {
      reports.push({
        report_name: excuse,
        specifiedReportDate:
          monthNames[specifiedReportDate - 1] || specifiedReportDate,
        uploadDate_day: new Date().toLocaleDateString(),
        uploadDate_month: new Date().getMonth(),
      });
    }
  } else {
    reports.push({
      report_name: excuse,
      specifiedReportDate:
        monthNames[specifiedReportDate - 1] || specifiedReportDate,
      uploadDate_day: new Date().toLocaleDateString(),
      uploadDate_month: new Date().getMonth(),
    });
  }
  return reports;
}
addreportToEmpData("monthly_report");

async function updateLateReport(reportState) {
  late_reports = await addreportToEmpData(reportState);
  await fetch(`http://localhost:3000/Employees/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      late_reports,
    }),
  });
}

async function getDateForReport(reportState) {
  let dateOfTask = await fetch(
    `http://localhost:3000/${reportState}/${reportID}`
  );
  let allDateOfTasks = await dateOfTask.json();

  if (reportState == "monthly_report") {
    return allDateOfTasks.date - 1 < new Date().getMonth();
  } else {
    return allDateOfTasks.date < new Date().toLocaleDateString();
  }
}

async function checkDataIntoFullReport() {
  let response = await fetch(`http://localhost:3000/Employees/${id}`);
  let employee = await response.json();
   
  return employee.full_reports.some(
    (fullReport) => fullReport.report_name === excuse
  );
}

///////////// end report classification for user
