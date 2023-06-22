//new register emp doesn't have username

checkNewRegister();
async function checkNewRegister() {
  let registerd = await fetch("http://localhost:3000/Employees");
  let DataRegistered = await registerd.json();
  let usersTable = document.querySelector("table tbody");

  DataRegistered.forEach((empRegestered) => {
    if (!empRegestered.user_name) {
      //emp register but not confirmed
      usersTable.innerHTML += `
    <tr>
    <td>${empRegestered.first_name + " " + empRegestered.last_name}</td>
    <td>${empRegestered.email}</td>
    <td><button class="btn btn-success confirm" onclick="confirmationEmp(this)"  id="${
      empRegestered.id
    }">Confirm</button></td>
    <td><button class="btn btn-danger  delete" onclick="deleteEmp(this)"  id="${
      empRegestered.id
    }">Delete</button></td>
</tr>
    `;
    }
  });
}

async function deleteEmp(btn){
    //alert 
      Swal.fire({
        title: 'Are you sure ?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.isConfirmed) { //admin confirm deleted
            sendDeleteEmail(btn.id);
            //delete user from server
            deleteUserFromServerBy(btn.id);
            btn.parentNode.parentNode.remove(); //delte tr from html
          Swal.fire(
            'Deleted!',
            'Employee has been deleted.',
            'success'
          )
        }
      })

   
    
}

async function confirmationEmp(btn) {
 
     //alert 
     Swal.fire({
      title: 'Are you sure ?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Confirm him!'
    }).then((result) => {
      if (result.isConfirmed) { //admin confirm Emp
 sendConfirmEmailandAddUserNameToServer(btn.id);
 btn.parentNode.parentNode.remove();
        Swal.fire(
          'Confirmed!',
          'Employee has been confirmed.',
          'success'
        )
      }
    })

}
async function sendDeleteEmail(id){
    let insertedData = await fetch(`http://localhost:3000/Employees?id=${id}`);
    let allData = await insertedData.json();
  
    if (allData.length > 0) {
      emailjs.init("txV5RAwzRQ6JTKJqh");
      emailjs.send("attendence_12345678", "template_c434x9p", {
        email_to:allData[0].email,
          message: `Sorry, Admin Delete you `,
          fullname: allData[0].first_name + " " + allData[0].last_name,
        })
        .then(
          function (response) {
            console.log("Email sent successfully!", response);
          },
          function (error) {
            console.error("Error sending email:", error);
          }
        );
  
      
    
    }
}

async function  deleteUserFromServerBy(id){
  await  fetch(`http://localhost:3000/Employees/${id}`, {
  method: "DELETE"
})
}

async function sendConfirmEmailandAddUserNameToServer(id) {
  let username = await UserName();
  console.log(username + "fromMail");
  let insertedData = await fetch(`http://localhost:3000/Employees?id=${id}`);
  let allData = await insertedData.json();

  if (allData.length > 0) {
    emailjs.init("txV5RAwzRQ6JTKJqh");
    emailjs.send("attendence_12345678", "template_c434x9p", {
        email_to:allData[0].email,
        message: `Hello, this is your user name : ${username}`,
        fullname: allData[0].first_name + " " + allData[0].last_name,
      })
      .then(
        function (response) {
          console.log("Email sent successfully!", response);
        },
        function (error) {
          console.error("Error sending email:", error);
        }
      );

    //send username to server
    await fetch(`http://localhost:3000/Employees/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ 'user_name': username,
        'absence_count':[],
        'late_count':[],
        'present_count':[],
        'late_reports':[],
        'excuse_reports':[],
        'full_reports':[]
      }),
    });
  }
}

function generateUsername() {
  let patern = "1234567890-qwertyuiopasdfghjklzxcvbnm/";
  let usernameGenerated = "";
  for (let i = 0; i < 8; i++) {
    let randmIndex = Math.floor(Math.random() * patern.length);
    usernameGenerated += patern[randmIndex];
  }
  return usernameGenerated;
}

async function IsUserNameUnique() {
  let checkUsername = await fetch("http://localhost:3000/Employees");
  let data = await checkUsername.json();

  let UniqueUserName;
  for (let i = 0; i < data.length; i++) {
    if (data[i].user_name == generateUsername()) {
      //username found in server

      generateUsername();
      IsUserNameUnique();
      break;
    } else {
      UniqueUserName = generateUsername();
    }
  }
  return UniqueUserName;
}

async function UserName() {
  let name = await IsUserNameUnique();
  return name;
}