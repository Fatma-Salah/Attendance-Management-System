document
  .getElementById("registration-form")
  .addEventListener("submit", function (e) {
    e.preventDefault();
    validateForm();
  });
  let emloyeeInfo;
async function validateForm() {
  let Fname = document.getElementById("Fname").value;
  let Lname = document.getElementById("Lname").value;
  let email = document.getElementById("email").value;
  let age = document.getElementById("age").value;
  let address = document.getElementById("address").value;
  let jobTitle = document.getElementById("job_title").value;
  let password = document.getElementById("password").value;
  let confirm_password = document.getElementById("confirm_password").value;
 emloyeeInfo = {
    //this information will added to server
    'first_name':Fname,
    'last_name':Lname,
    'email':email,
    'age':age,
    'address':address,
    'job_title':jobTitle,
    'password':password,
    'registeration_day': new Date().toISOString().slice(0, 10),
    'state':"user",
  }
  error = document.querySelectorAll(".error");
  error.forEach(function (e) {
    e.innerHTML = " ";
  });
  if (Fname.trim() === "") {
    document.getElementById("Fname-error").innerHTML = "First name is required";
  }

  if (Lname.trim() === "") {
    document.getElementById("Lname-error").innerHTML = "Last name is required";
  }

  if (age.trim() === "") {
    document.getElementById("age-error").innerHTML = "Age is required";
  }

  if (address.trim() === "") {
    document.getElementById("address-error").innerHTML = "Address is required";
  }

  if (jobTitle.trim() === "") {
    document.getElementById("job-title-error").innerHTML = "job title is required";
  }

  if (email.trim() === "") {
    document.getElementById("email-error").innerHTML = "Email is required";
  } else if (!isValidEmail(email)) {
    document.getElementById("email-error").innerHTML = "Invalid email format";
  } else if (await verificationEmail(email)) {
    document.getElementById("email-error").innerHTML =
      " email format  is duplicated,Try with another one";
  }

  if (password.trim() === "") {
    document.getElementById("password-error").innerHTML =
      "Password is required";
  } else if (password.trim().length < 8) {
    document.getElementById("password-error").innerHTML =
      "Password must be at least 8 characters long";
  }

  if (confirm_password.trim() === "") {
    document.getElementById("confirm-password-error").innerHTML =
      "Confirm password is required";
  } else if (password !== confirm_password) {
    document.getElementById("confirm-password-error").innerHTML =
      "Passwords do not match";
  }
  
  if (
    Fname.trim() !== "" &&
    Lname.trim() !== "" &&
    age.trim() !== "" &&
    address.trim() !== "" &&
    jobTitle.trim() !== "" &&
    email.trim() !== "" &&
    !(await verificationEmail( email ))&&
    password.trim() !== "" &&
    password.length >= 8 &&
    confirm_password.trim() !== "" &&
    password === confirm_password
  ) {
    await   addEMP();
      Alert();
  }
}
function isValidEmail(email) {
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}
async function addEMP() {

  await fetch(`http://localhost:3000/Employees`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(emloyeeInfo),
  });
}
async function verificationEmail(mail) {
  let insertedData = await fetch("http://localhost:3000/Employees");
  let allData = await insertedData.json();

  return  allData.some(data => data.email === mail); 

}

function Alert() {
  Swal.fire({
    title: "Registration successful  ",
   html: `<p style="line-height:1.5;text-align:justify"> We will send your username via email after admin confirm you , sent the email to <span style="font-size:px; color:#cb7c09">" ${email.value} "</span> Check your inbox to activate the account. If the confirmation email is not in your inbox, please check the Spam.<p style="text-align:center"> Thank you </p></p>`,
    icon: "warning",
    confirmButtonColor: "#3085d6",
    confirmButtonText: "Ok",
  }).then((result) => {
    if (result.isConfirmed) {
      setTimeout("location.href = 'index.html';");
    }
  });
}


