
async function getAllEmployeeReport(){
    let allEmp = await fetch("http://localhost:3000/Employees");
    let allEmpData = await allEmp.json();
    let tableBody = document.querySelector('table tbody');
    if(allEmpData.length>0){
      allEmpData.forEach((employee)=>{
       if(employee.user_name){
        tableBody.innerHTML += `
        <tr>
        <td>${employee.first_name+' '+employee.last_name}</td>
        <td>${employee.late_reports.length}</td>
        <td>${employee.excuse_reports.length}</td>
        <td>${employee.full_reports.length}</td>
        <td>
        <button  class=" btn btn-primary" type="button" data-bs-toggle="collapse" data-bs-target="#collapse${employee.id}" >
        Show Details
      </button>
        <table class="table collapse " id="collapse${employee.id}">
          <thead>
            <tr>
              <th>Age</th>
              <th>Address</th>
              <th>late count</th>
              <th>Job Title</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>${employee.age}</td>
              <td>${employee.address}</td>
              <td>${employee.late_count.length}</td>
              <td>${employee.job_title}</td>
            </tr>
          </tbody>
        </table>
        </td>
      </tr>
        `;
       }
      })
    }
  }