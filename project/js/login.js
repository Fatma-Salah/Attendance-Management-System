document.querySelector("form").addEventListener("submit", async(e) => {
  e.preventDefault();
  validate();
  fetchEmail();
 
});

let email = document.querySelector("#email");
let password = document.querySelector("#password");
let UserName = document.querySelector("#userName");

function validate() {
  error = document.querySelectorAll(".error");
  error.forEach(function (e) {
    e.innerHTML = " ";
  });

  if (email.value.trim() == "") {
    document.getElementById("email-error").innerHTML = "Email is required";
  }

  if (UserName.value.trim() == "") {
    document.getElementById("userName-error").innerHTML = "UserName is required";
  }

  if (password.value.trim() == "") {
    document.getElementById("password-error").innerHTML =
      "password is required";
  }
}

async function fetchEmail() {
  let insertedData = await fetch(
    `http://localhost:3000/Employees?email=${email.value}`
  );
  allData = await insertedData.json();

  if (email.value.trim() != "" && password.value.trim() != "" && UserName.value.trim() != "") {
    if (allData.length > 0) {//email found
      //check username and password 
      checkUserNameAndPassword(allData)
    } else { // email not found
      document.getElementById("email-error").innerHTML =
        "Email doesn't exist , try using another one";
    }
  }
}

async function checkUserNameAndPassword(data) {
  if (data[0].password == password.value && data[0].user_name == UserName.value) {
     Login();
  } else {
    if (data[0].user_name != UserName.value) {
      document.getElementById("userName-error").innerHTML =
        "user name doesn't matched";
    }
    if (data[0].password != password.value) {
      document.getElementById("password-error").innerHTML =
      "Password doesn't matched";
    }
    
  }
}


async function Login() {
    let logedData = await fetch(
      `http://localhost:3000/LoginEmp?email=${email.value}`
    );
    let allLogedData = await logedData.json();
    if (allLogedData.length > 0) { // check if there logged user
  // add id to local storage
  localStorage.setItem('userId', allLogedData[0].id);
      if (allLogedData[0].login_day == new Date().toISOString().slice(0, 10)) {
        confirmAttend_swalLibrary();
      } else {//user don't loged today
      await  addLogedUserToServer( allData);
      }
    } else { //no user in login server
    await  addLogedUserToServer( allData);
    }

}

async function addLogedUserToServer(allData ) {
   confirmAttend_swalLibrary();
  // add login data info to server
  await fetch("http://localhost:3000/LoginEmp", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(...allData),
  });
  // update server with login date
await  updateLoginnServerWith({"login_day":new Date().toISOString().slice(0, 10),"login_time":new Date().toLocaleTimeString(),})
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
    .then((result) => {
      if (result.isConfirmed) {
        confirmAttendance();
        checkState();
       
       
      } else if (
        /* Read more about handling dismissals below */
        result.dismiss === Swal.DismissReason.cancel
      ) {
        checkState();
       
      }
    });
}

async function confirmAttendance(){
 await updateLoginnServerWith({'date_Attendance': new Date().toLocaleTimeString()});

}

// async function addAttendanceToServer(){
//     let attendance = await fetch(  `http://localhost:3000/LoginEmp?email=${email.value}`);
//     let AttendenceConfirmed =await attendance.json();
//     let attend = {
//         "full_name": allData[0].first_name + " " + allData[0].last_name,
//         "email": email.value,
//         "user_name": allData[0].user_name,
//         "date_Attendance": new Date().toLocaleTimeString(),
//         "day": new Date().toISOString().slice(0, 10),
//       };
//       if(AttendenceConfirmed.length >0){
//         await fetch("http://localhost:3000/Attendance", {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//           },
//           body: JSON.stringify(attend),
//         });
      
//     }
//       }

    function checkState(){
        if(allData.length >0){
            if(allData[0].state=='user'){
                setTimeout("location.href = 'employee.html'");
            }
            if(allData[0].state=='admin'){
                setTimeout("location.href = 'admin.html'");
            }
        }
     }
    
     async function updateLoginnServerWith(data){
      await fetch(`http://localhost:3000/LoginEmp/${allData[0].id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
    }

    //////////////////////////
async function fetchAllLogEmp(id) {
  let AllEmp = await fetch(`http://localhost:3000/LoginEmp/${id}`);
  let AllEmpData = await AllEmp.json();
  return AllEmpData;
}
async function updateStateLogin(id,late_count,present_count) {
 
  emp = await fetchAllLogEmp(id);
  pushDataToCount(id,present_count);
  insertPresentCountTime(present_count,id)

  if(emp.login_time <'9:30:00 AM'){
    pushDataToCount(id,late_count );
    insertLateCountTime(late_count,id)
  }
}

async function pushDataToCount(id,state ){
  emp = await fetchAllLogEmp(id);
 count =await emp[state] || [];
  if(count.length >0){
    if(!count.some((data) =>( data.lateLoginDateDay === new Date().toLocaleDateString()))){
      count.push({
        'lateLoginDate':new Date().toLocaleTimeString(),
        'lateLoginDateDay':new Date().toLocaleDateString()
      });
    }
  }else{
      count.push({
        'lateLoginDate':new Date().toLocaleTimeString(),
        'lateLoginDateDay':new Date().toLocaleDateString()
      });
    }
    return count;
} 

async function insertLateCountTime(count,id){
  late_count= await pushDataToCount(id,count)
  await fetch(`http://localhost:3000/Employees/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      late_count
    }),
  });
}
async function insertPresentCountTime(count,id){
  present_count= await pushDataToCount(id,count)
  await fetch(`http://localhost:3000/Employees/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      present_count
    }),
  });
}

  // updateStateLogin('2','late_count','present_count'); //?????????????????
 