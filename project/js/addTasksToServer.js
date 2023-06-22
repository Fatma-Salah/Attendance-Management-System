let monthlyReportBtn = document.getElementById("monthlyReport");
let dailyReportBtn = document.getElementById("dailyReport");
let descriptionMonthlyReport = document.getElementById("descriptionMonthlyReport");
let descriptionDailyReport = document.getElementById("descriptionDailyReport");
 
dailyReportBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  validateDaily();
});
 
monthlyReportBtn.addEventListener("click", async function (e) {
  e.preventDefault();
  validateMonthly();
});

async function validateMonthly(){
    error = document.querySelectorAll(".error");
    error.forEach(function (e) {
      e.innerHTML = " ";
    });

    if (descriptionMonthlyReport.value.trim() === "") {
        document.getElementById("monthlyReport-error").innerHTML = "Report description is required";
      }else{
        await checkDateBeforeAddReportTo('monthly_report',(new Date().getMonth()+1),(new Date().getMonth()+1),'monthly_report',descriptionMonthlyReport.value);
      }
}
async function validateDaily(){
    error = document.querySelectorAll(".error");
    error.forEach(function (e) {
      e.innerHTML = " ";
    });

    if (descriptionDailyReport.value.trim() === "") {
        document.getElementById("dailyReport-error").innerHTML = "Report description is required";
      }else{
        await checkDateBeforeAddReportTo('daily_report',(new Date().toLocaleDateString()),new Date().toLocaleDateString(),'daily_report',descriptionDailyReport.value);
      }
}



function createContentReport(date,reportName) {
  return {
    'description': reportName,
    'date': date,
  };
}
async function addReportToServer(reportServer,date,reportName) {
  let data = createContentReport(date,reportName);

  let dailyReportResponse = await fetch(`http://localhost:3000/${reportServer}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  return await dailyReportResponse.json();
}
async function fetchReports(reportCategory) {
  let AllReport = await fetch(`http://localhost:3000/${reportCategory}`);
  let AllReportData = await AllReport.json();
  return await AllReportData;
}

async function checkDateBeforeAddReportTo(server,date,currentDate,reportCategory,reportName) {
  let AllReportInServer = await fetchReports(reportCategory);

  if (AllReportInServer.length > 0) { // there is at least on report
    if (
      AllReportInServer.some(
        (report) => report.date === currentDate
      )
    ) {
      Swal.fire("Report  already uploaded");
    } else {
      await addReportToServer(server,date,reportName);
    }
  } else {  //no report in server
    await addReportToServer(server,date,reportName);
  }
}
