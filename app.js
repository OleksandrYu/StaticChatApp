function getToken() {
  try {
    const token = this.getLocalItem("AccessToken");
    if (!token) {
      // throw new Error('Token not provided');
      return null;
    }
    const expirationTime = new Date(this.getLocalItem("tokenExpiration"));
    const now = new Date();
    if (!expirationTime || expirationTime.getTime() - now.getTime() < 0) {
      throw new Error("Token expired");
    }
    return token;
  } catch (err) {
    console.error(err);
    return null;
  }
}

function setLocalUserInfo(token, userId, login) {
  try {
    localStorage.setItem("AccessToken", token);
    localStorage.setItem("UserId", userId);
    localStorage.setItem("Login", login);
    const expiration = new Date();
    expiration.setHours(expiration.getHours() + 1);
    localStorage.setItem("tokenExpiration", expiration.toISOString());
  } catch (err) {
    console.error(err);
  }
}

function Register(authData) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/api/user/register", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(new Error("Request failed "));
        }
      }
    };

    xhr.send(JSON.stringify(authData));
  });
}

function Login(inputData) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/api/user/login", true);

    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(new Error("Request failed"));
        }
      }
    };

    xhr.send(JSON.stringify(inputData));
  });
}

function GetUserInfo() {
  try {
    const userId = getLocalItem("UserId");

    return new Promise(function (resolve, reject) {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", `http://localhost:3000/api/user/${userId}`, true);

      xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
          if (xhr.status === 200) {
            resolve(xhr.responseText);
          } else {
            reject(new Error("Request failed"));
          }
        }
      };

      xhr.send();
    });
  } catch (err) {
    console.error(err);
    return null;
  }
}

function GetMsg() {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://localhost:3000/api/chat", true);
    xhr.setRequestHeader("Authorization", "Bearer " + getToken());

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(JSON.parse(xhr.responseText));
        } else {
          reject(new Error("Request failed"));
        }
      }
    };

    xhr.send();
  });
}

function getLocalItem(itemName) {
  try {
    const item = localStorage.getItem(itemName);
    if (!item) {
      throw new Error(`No ${itemName} provided`);
    }
    return item;
  } catch (err) {
    console.warn(err);
    return null;
  }
}

function SendMsg(inputData) {
  return new Promise(function (resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:3000/api/chat/message", true);

    xhr.setRequestHeader("Authorization", "Bearer " + getToken());
    xhr.setRequestHeader("Content-Type", "application/json");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          resolve(xhr.responseText);
        } else {
          reject(new Error("Request failed"));
        }
      }
    };
    console.log(inputData);
    console.log(JSON.stringify(inputData));
    xhr.send(JSON.stringify(inputData));
  });
}
