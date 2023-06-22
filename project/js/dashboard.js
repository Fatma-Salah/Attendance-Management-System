let totalEmployee= document.querySelector('.total');
let onTimeEmployee = document.querySelector('.onTime');
let absentEmployee = document.querySelector('.absent');
let lateEmployee = document.querySelector('.late');


async function fetchAllEmployee() {
    let AllEmployee = await fetch("http://localhost:3000/Employees");
    let AllEmployeeData = await AllEmployee.json();
    return await AllEmployeeData.length;
  }

  async function fetchAllLoginEmployee() {
    let AllLoginEmployee = await fetch("http://localhost:3000/LoginEmp");
    let AllLoginEmployeeData = await AllLoginEmployee.json();
    return await AllLoginEmployeeData ;
  }
 
  let  lateEmp=0;
  let  onTimeEmp=0;

  async function checkstateLogin() {
    let loginEmp = await fetchAllLoginEmployee();
    let lateHour = new Date();
    lateHour.setHours(9, 30, 0, 0);
    if(loginEmp.length >0){
        for(let i=0 ; i<loginEmp.length ;i++){
            if(loginEmp[i].login_time > lateHour.toLocaleTimeString()){
                onTimeEmp++;
            }else if(loginEmp[i].login_time <=lateHour.toLocaleTimeString()){
                lateEmp ++;
              }
            }
        }
  }

  async function getNumberOfEmployee(){
    let totalEmpNumber=await fetchAllEmployee();
    let allLoginEmp= await fetchAllLoginEmployee();

totalEmployee.innerHTML=`
<h1 id="total">${totalEmpNumber}</h1>
<p>Total Employees</p>
`;
onTimeEmployee.innerHTML =`
<h1 id="onTime">${onTimeEmp}</h1>
<p>On Time</p>
`;
lateEmployee.innerHTML=`
<h1 id="late">${lateEmp}</h1>
<p>Late</p>
`;
absentEmployee.innerHTML=`
<h1 id="absent">${totalEmpNumber - allLoginEmp.length}</h1>
    <p>Absent</p>
`;


  }
  checkstateLogin();
  getNumberOfEmployee();