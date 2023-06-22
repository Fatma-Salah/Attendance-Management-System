let logOut=document.getElementById('log_out');
let userId = localStorage.getItem("userId");

async function logout(){
await fetch(`http://localhost:3000/LoginEmp/${userId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }});
}
async function setLogDateToServer(){console.log('jk');
        await fetch(`http://localhost:3000/Employees/${userId}`, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              'logout_time': (new Date().toLocaleTimeString() + " at  " + new Date().toLocaleDateString()),
            }),
          });
    }

logOut.addEventListener('click',function(){
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: ' Log Out'
      }).then((result) => {
        if (result.isConfirmed) {
            setLogDateToServer();
            logout();
            setTimeout("location.href = 'index.html'");
        }
      })
})
/////////////////////logOut all
async function fetchAllLoginEmployee() {
    let AllEmployee = await fetch("http://localhost:3000/LoginEmp");
    let AllEmployeeData = await AllEmployee.json();
    return await AllEmployeeData;
  }

function deleteEmpBy(id){
fetch(`http://localhost:3000/LoginEmp/${id}`, {
  method: 'DELETE',
  headers: { 
    "Content-Type": "application/json"
  }
})
  .then(response => {
    if (response.ok) {
      console.log('Data successfully deleted');
    } else {
      throw new Error('Failed to delete data');
    }
  })
  .catch(error => console.error(error))
}

async function logOutAll(){
    let AllLogin= await fetchAllLoginEmployee();
    if(AllLogin.length > 0){
        for(let i=0 ; i<AllLogin.length ; i++){
          await  deleteEmpBy(AllLogin[i].id);
        }
    }
}
// logOutAll()
if( new Date().toLocaleTimeString() >= '7:00:00 PM'){
    logOutAll()
}