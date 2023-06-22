let attendanceReport =document.getElementById('attendanceReport');
let monthReport =document.getElementById('monthReport');
let dailyReport =document.getElementById('dailyReport');

let attendanceReportDiv=document.getElementsByClassName('attendanceReport')[0];
let monthReportDiv=document.getElementsByClassName('monthReport')[0];
let dailyReportDiv = document.getElementsByClassName('dailyReport')[0];

let empInfo=document.querySelector('.empInfo ');
let imageEmp=document.querySelector('.imageEmp');
let contactInfo=document.querySelector('.contactInfo');
let AttendanceReport = document.querySelector('.attendanceReport table tbody');
let MonthReport = document.querySelector('.monthReport table tbody');
let DailyReport = document.querySelector('.dailyReport table tbody');

attendanceReport.addEventListener('click',function(){
    removeMonthReport();
    removeDailyReport();
    attendanceReport.classList.add('clickP');
    attendanceReportDiv.style.cssText='display:block !important';
});

monthReport.addEventListener('click',async function(){
    removeAttendceReport();
    removeDailyReport();
    monthReport.classList.add('clickP');
    monthReportDiv.style.cssText='display:block !important';
});

dailyReport.addEventListener('click',async function(){
    removeAttendceReport();
    removeMonthReport();
    dailyReport.classList.add('clickP');
    dailyReportDiv.style.cssText='display:block !important';
});

function removeAttendceReport(){
    attendanceReport.classList.remove('clickP');
    attendanceReportDiv.style.cssText='display:none !important';
}
function removeMonthReport(){
    monthReport.classList.remove('clickP');
    monthReportDiv.style.cssText='display:none !important';
}
function removeDailyReport(){
    dailyReport.classList.remove('clickP');
    dailyReportDiv.style.cssText='display:none !important';
}

//////////////////////start aside ////////
let  clickedEmployeeId =sessionStorage.getItem('clickedEmployeeId') ||localStorage.getItem('userId');
async function fetchEmployee(){
    let employeeResponce=await fetch(`http://localhost:3000/Employees/${clickedEmployeeId}`);
    let employeesData= await employeeResponce.json();
   return  employeesData ;
} 
async function fetchEmployeeLogin(){ 
    let employeeLoginResponce=await fetch(`http://localhost:3000/LoginEmp/${clickedEmployeeId}`);
    let employeesLoginData= await employeeLoginResponce.json();
   return  employeesLoginData ;
} 
async function fetchReport(reportCategory){
    let employeeLoginResponce=await fetch(`http://localhost:3000/${reportCategory}`);
    let employeesLoginData= await employeeLoginResponce.json();
   return  employeesLoginData ;
} 
async function getDatafromServerToAside(){
    let employeesData =await fetchEmployee();
    let employeeLogin=await fetchEmployeeLogin();
    let time=(employeeLogin.login_day + '  '+employeeLogin.login_time) || 'user dont login yet';
    console.log(employeesData);
    console.log(employeeLogin);
    empInfo.innerHTML +=`
    <h4>${employeesData.first_name + ' ' + employeesData.last_name}</h4>
    <h3>( ${employeesData.job_title} )</h3>
    <p class="fs-4">Age : ${employeesData.age} </p>
    <p class="fs-4">Address : ${employeesData.address} </p>
    <p class="p-2 fs-4">Today: <span id="date">${time}</span></p>
    `;
    imageEmp.innerHTML=employeesData.first_name.slice(0,1);
    contactInfo.innerHTML+=`
    <h5 class="px-2"><span class="text-secondary ps-2">E-mail : </span> <span>${employeesData.email}</span></h5>
    `; 
}
getDatafromServerToAside();
getDatafromServerToAttendanceReport();
async function getDatafromServerToAttendanceReport(){
     let employeesData =await fetchEmployee();
    let employeeLogin=await fetchEmployeeLogin();
    AttendanceReport.innerHTML +=`
    <tr>
        <td>${employeeLogin.login_day || "employee doesn't login today " }</td>
        <td>${employeeLogin.login_time  || "employee doesn't login today "}</td>
        <td>${employeesData.logout_time  || "employee doesn't login today "}</td>
    </tr>
    `;
} 

async function GetReport(div,reportCategory){
    let employeesreport =await fetchReport(reportCategory);
    let employeesData =await fetchEmployee();

    let checked;
    for(let i=0 ;i<employeesreport.length ; i++){
      if(employeesData.full_reports.some( (fullReport) =>(fullReport.report_name) ===(employeesreport[i].description + employeesreport[i].date))){
        checked = 'fa fa-check'; 
      }else{ checked = ' '}
        div.innerHTML +=`
        <tr>
        <td>${employeesreport[i].id}</td>
        <td>${employeesData.first_name } ${employeesData.last_name}</td>
        <td> ${employeesreport[i].description + '  '+reportCategory.split('_')[0]} </td>
        
        <td><i class="${checked}"></i></td>
        <th>${employeesData.email}</th>
    </tr>
        `;
    }
 
}
async function checkFullReport(reportDescription) {
    let response = await fetch(`http://localhost:3000/Employees/${clickedEmployeeId}`) ;
    let employee = await response.json();

    return employee.full_reports.some(
      (fullReport) => fullReport.report_name === reportDescription
    );
  }

async function updateLoginnServerWith(data){
    await fetch(`http://localhost:3000/Employees/${clickedEmployeeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }
  async function confirmAttendance(){
    await updateLoginnServerWith({'date_Attendance': new Date().toLocaleTimeString()});
   
   }
   function confirmAttend_swalLibrary() {
    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: "btn btn-success",
        cancelButton: "btn btn-danger",
      },
      buttonsStyling: false,
    });
  
    swalWithBootstrapButtons
      .fire({
        title: "you logged to server today",
        text: " Are you Want to confirm attendance??",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, Confirm Me ",
        cancelButtonText: "No, cancel!",
        reverseButtons: true,
      })
      .then(async(result) => {
        if (result.isConfirmed) {
       await   confirmAttendance();
        } else if (
          /* Read more about handling dismissals below */
          result.dismiss === Swal.DismissReason.cancel
        ) {
         
        }
      });
  }
  
  async function getReports(){
await GetReport(DailyReport ,'daily_report');

await GetReport(MonthReport,'monthly_report');
  }
  
  getReports();
////////////////// end aside ///////////
