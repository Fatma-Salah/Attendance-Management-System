let dashboardIcon = document.getElementById("dashboard");
let settingIcon = document.getElementById("setting");
let teamMemberIcon = document.getElementById("teamMember");
let newEmployees = document.getElementById("newEmp");

let dashboardItems = document.querySelectorAll(".dashboard");
let teamMemberItems = document.querySelectorAll(".teamMember");
let reportsInfo=document.querySelector('.reportsInfo');

dashboardIcon.addEventListener("click", function () {
  deleteTeamMember();
  deleteSettingInfo();
  dashboardIcon.classList.add('clickedIcon');
  dashboardItems.forEach((item) => {
    item.style.cssText = `display:flex !important;`;
  });
});

settingIcon.addEventListener("click", function () {
  deleteTeamMember();
  deleteDashboard();
  settingIcon.classList.add('clickedIcon');
  reportsInfo.style.cssText = `display:block !important;`;
  getAllEmployeeReport();
});

teamMemberIcon.addEventListener("click", function () {
  deleteDashboard();
  deleteSettingInfo();
  teamMemberItems.forEach((item) => {
    item.style.cssText = `display:flex !important`;
    teamMemberIcon.classList.add('clickedIcon');
  });
  getAllEmp();
});
newEmployees.addEventListener("click", function () {
  
    setTimeout("location.href = 'newEmp.html'", 200);
});

function deleteDashboard() {
  dashboardItems.forEach((item) => {
    item.style.cssText = `display:none!important;`;
  });
  dashboardIcon.classList.remove('clickedIcon');
}
function deleteSettingInfo(){
  reportsInfo.style.cssText = `display:none !important;`;
  settingIcon.classList.remove('clickedIcon');
}
function deleteTeamMember() {
  teamMemberItems.forEach((item) => {
    item.style.cssText = `display:none`;
  });
  teamMemberIcon.classList.remove('clickedIcon');
}

//get AllEmployee
let allEmployeeContainer = document.getElementById("allEmployee");

let className='' ;
async function getAllEmp() {

  let allEmp = await fetch("http://localhost:3000/Employees");
  let allEmpData = await allEmp.json();

  for (let i = 0; i < allEmpData.length; i++) {
    await checkstateLoginToChangeBG(`${allEmpData[i].email}`);  

    allEmployeeContainer.innerHTML += `
        <div id="${allEmpData[i].id}" class="employee ${className} mt-3 mb-5 p-3 fs-4" onclick="addIdToSessionStorage(this)">
           <p class="image  ${className} fs-2 text-capitalize">${ allEmpData[i].first_name.split('')[0] + "." + allEmpData[i].last_name.split('')[0]}</p>
           <div class="mt-5">
               <h3>${
                 allEmpData[i].first_name + " " + allEmpData[i].last_name
               } </h3>
               <p>( ${allEmpData[i].job_title} )</p>
               <p>${allEmpData[i].email}</p>
               <p class="time">Joining data: <span> ${
                 allEmpData[i].registeration_day
               }</span></p>
           
           </div>
           
        </div>
        
`; 
    showEmployeeInfo();
  }
}

//get state login of user
async function checkstateLoginToChangeBG(email) {
  let emp = await fetch(`http://localhost:3000/LoginEmp?email=${email}`);
  let empData = await emp.json();
  if (empData.length > 0 ) {
    if(empData[0].date_Attendance){ // emp confirm attend
      let lateHour = new Date();
      lateHour.setHours(9, 30, 0, 0);
      if (empData[0].login_time >= lateHour.toLocaleTimeString()) {
        className = "present";
      }
      if (empData[0].login_time < lateHour.toLocaleTimeString() && empData[0].date_Attendance) {
        className = "late";
      }
    }
    if(empData[0].date_Attendance == undefined) {
      className = "notMarkingAttend";
    }
  
  } else {
    className = "notMarkingAttend";
  }
}

async function showEmployeeInfo() {
  let employees = await document.querySelectorAll(".employee");
  employees.forEach((emp) => {
    emp.addEventListener("click", function () {
      setTimeout("location.href = 'employeeInfo.html'", 200);
    });
  });
}

function addIdToSessionStorage(btn){
  sessionStorage.setItem('clickedEmployeeId',btn.id);

}