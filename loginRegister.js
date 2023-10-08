function storeData(uname, jwttoken, role, id, branchCode) {
  this.username = uname;
  this.token = jwttoken;
  this.role = role;
  this.id = id;
  this.branchCode = branchCode;
}

function userlogin(username, password) {
  this.username = username;
  this.password = password;
}

function register(registerRequestBody) {
  let registerRequest = new XMLHttpRequest();
  let url = "http://localhost:8080/register";
  registerRequest.open("POST", url);
  registerRequest.setRequestHeader("content-type", "application/json");
  registerRequest.send(JSON.stringify(registerRequestBody));
  registerRequest.onload = function () {
    let data = JSON.parse(registerRequest.responseText);
    console.log(data);
    if (registerRequest.status == 200) {
      login(
        new userlogin(
          registerRequestBody.username,
          registerRequestBody.password
        )
      );
    } else {
      Swal.fire({
        icon: "error",
        title: `Could Not Register}`,
        button: "OK",
        timer: 3000,
      });
    }
  };
}

function login(loginRequestBody) {
  let xmlhttp = new XMLHttpRequest();
  let url = "http://localhost:8080/login";
  xmlhttp.open("POST", url);
  let data = JSON.stringify(loginRequestBody);
  xmlhttp.setRequestHeader("content-type", "application/json");

  xmlhttp.send(data);
  xmlhttp.onload = function () {
    let data = JSON.parse(xmlhttp.responseText);
    if (xmlhttp.status == "401") {
      Swal.fire({
        icon: "error",
        title: `${data["error"]}`,
        button: "OK",
        timer: 3000,
      });
    }
    if (xmlhttp.status == 200) {
      let info = new storeData(
        data["userName"],
        data["token"],
        data["role"],
        data["empcustid"],
        data["branchCode"]
      );
      console.log("here we go");
      console.log(info);
      console.log(data);
      localStorage.setItem("userDetails", JSON.stringify(info));

      let roleVal = data["role"];
      console.log(roleVal);

      if (roleVal == 0) {
        window.location.assign("manager.html");
        console.log(info);
      } else if (roleVal == 1) {
        window.location.assign("clerk.html");
      } else if (roleVal == 2) {
        window.location.assign("customer.html");
      }
    } else {
      Swal.fire({
        icon: "error",
        title: `Could Not Login`,
        button: "OK",
        timer: 3000,
      });
    }
  };
}
