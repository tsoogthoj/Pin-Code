// Navigation
$("#nav-timeClockSheet-tab").click(function () {
  $("#nav-staff").fadeOut();
  setTimeout(function () {
    $("#nav-timeClockSheet").fadeIn();
  }, 500);
});

$("#nav-staff-tab").click(function () {
  $("#nav-timeClockSheet").fadeOut();
  setTimeout(function () {
    $("#nav-staff").fadeIn();
  }, 500);
});

// limit pin input to 4
var max_chars = 4;

$("#newPin").keydown(function (e) {
  if ($(this).val().length >= max_chars) {
    $(this).val($(this).val().substr(0, max_chars));
  }
});

$("#newPin").keyup(function (e) {
  if ($(this).val().length >= max_chars) {
    $(this).val($(this).val().substr(0, max_chars));
  }
});

// Toggle change of text - expand/collase
$("#toggleAddStaffForm").click(function () {
  let toggle = $("#toggleAddStaffForm").attr("aria-expanded");
  if (toggle === "false") {
    $("#toggleText").text(" (Click to collapse)");
  }
  if (toggle === "true") {
    $("#toggleText").text(" (Click to expand)");
  }
});

/////////////// Calendar //////////////////
const currentTime = moment();
const startOfWeekMon = parseInt(currentTime.startOf("week").format("DD")) + 1;
const endOfWeekFri = parseInt(moment().endOf("week").format("DD")) - 1;
const currentMonth = moment().format("MM");
const currentYear = moment().format("YYYY");
const monthAbr = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
let daysInMonth;
let startingDay = 1;
let weekArray = {
  0: {
    month: 10,
    day: 1,
    year: currentYear,
  },
  1: {
    month: 10,
    day: 1,
    year: currentYear,
  },
  2: {
    month: 10,
    day: 1,
    year: currentYear,
  },
  3: {
    month: 10,
    day: 1,
    year: currentYear,
  },
  4: {
    month: 10,
    day: 5,
    year: currentYear,
  },
};

// display weekdays
function displayWeekdays() {
  let displayText = [];
  for (let i = 0; i < 5; i++) {
    displayText.push(" - " + weekArray[i]["day"]);
  }
  $(".mon").children("span").text(displayText[0]);
  $(".tue").children("span").text(displayText[1]);
  $(".wed").children("span").text(displayText[2]);
  $(".thu").children("span").text(displayText[3]);
  $(".fri").children("span").text(displayText[4]);
}

// get number of days of month
let numberOfDays = function (year, month) {
  daysInMonth = moment(year + "-" + month).daysInMonth();
};
// increase days and check for going into next month
let increaseDays = function () {
  for (let i = 0; i < 5; i++) {
    weekArray[i]["day"] = weekArray[0]["day"] + i;
    weekArray[i]["month"] = weekArray[0]["month"];
    weekArray[i]["year"] = weekArray[0]["year"];
    // check for going into next month
    if (weekArray[i]["day"] > daysInMonth) {
      numberOfDays(weekArray[i]["year"], weekArray[i]["month"]);
      weekArray[i]["month"] = parseInt(weekArray[i]["month"]) + 1;
      // going to next year
      if (parseInt(weekArray[i]["month"]) === 13) {
        weekArray[i]["month"] = 1;
        weekArray[i]["year"] = parseInt(weekArray[i]["year"]) + 1;
      }
      weekArray[i]["day"] = startingDay;
      startingDay++;
    }
    if (parseInt(weekArray[i]["month"]) === 13) {
      weekArray[i]["month"] = 1;
      weekArray[i]["year"] = weekArray[i]["year"] + 1;
    }
    if (parseInt(weekArray[i]["month"]) === 0) {
      weekArray[i]["month"] = 12;
      weekArray[i]["year"] = weekArray[i]["year"] - 1;
    }
  }
  startingDay = 1;
};

// Display Week
function displayDates() {
  let firstMonth = weekArray[0]["month"];
  // change month number to month abbreviation
  for (let i = 0; i < monthAbr.length; i++) {
    if (firstMonth.toString() === (i + 1).toString()) {
      firstMonth = monthAbr[i];
    }
  }

  let monday = weekArray[0]["day"];
  let firstYear = ", " + weekArray[0]["year"];
  let secondMonth = weekArray[4]["month"];
  // change month number to month abbreviation
  for (let i = 0; i < monthAbr.length; i++) {
    if (secondMonth.toString() === (i + 1).toString()) {
      secondMonth = monthAbr[i];
    }
  }

  let friday = weekArray[4]["day"];
  let secondYear = ", " + weekArray[4]["year"];
  // check same year
  if (weekArray[0]["year"] === weekArray[4]["year"]) {
    firstYear = "";
  }
  // check same month
  if (weekArray[0]["month"] === weekArray[4]["month"]) {
    secondMonth = "";
  }
  $(".navDateRange").text(
    firstMonth +
      " " +
      monday +
      firstYear +
      " - " +
      secondMonth +
      " " +
      friday +
      secondYear
  );
  displayWeekdays();
}

// go back one week
function backWeek() {
  weekArray[0]["day"] = weekArray[0]["day"] - 7;
  // Monday
  if (parseInt(weekArray[0]["day"]) < 0) {
    numberOfDays(weekArray[0]["year"], parseInt(weekArray[0]["month"]) - 1);
    weekArray[0]["day"] = parseInt(daysInMonth) + parseInt(weekArray[0]["day"]);
    weekArray[0]["month"] = parseInt(weekArray[0]["month"]) - 1;
  }

  if (parseInt(weekArray[0]["day"]) === 0) {
    weekArray[0]["month"] = parseInt(weekArray[0]["month"]) - 1;
    if (parseInt(weekArray[0]["month"]) === 0) {
      weekArray[0]["month"] = 12;
      weekArray[0]["year"] = parseInt(weekArray[0]["year"]) - 1;
    }
    numberOfDays(weekArray[0]["year"], weekArray[0]["month"]);
    weekArray[0]["day"] = daysInMonth;
  }
  increaseDays();
  displayDates();
}

// go forward one week
function forwardWeek() {
  weekArray[0]["day"] = weekArray[0]["day"] + 7;
  numberOfDays(weekArray[0]["year"], weekArray[0]["month"]);

  if (parseInt(weekArray[0]["day"]) > daysInMonth) {
    weekArray[0]["day"] = weekArray[0]["day"] - daysInMonth;
    weekArray[0]["month"] = parseInt(weekArray[0]["month"]) + 1;
  }

  increaseDays();
  displayDates();
}

// get the current week
let getCurrent = function () {
  for (let i = 0; i < 5; i++) {
    weekArray[i]["month"] = currentMonth;
  }
  weekArray[0]["day"] = startOfWeekMon;
  increaseDays();
  displayDates();
  displayWeekdays();
};
getCurrent();

// Initialize Firebase
var config = {
  apiKey: "AIzaSyAcADcaoayZEsNr9XAaRpat0C2pwwQzWV0",
  authDomain: "time-clock-1d087.firebaseapp.com",
  projectId: "time-clock-1d087",
  storageBucket: "time-clock-1d087.appspot.com",
  messagingSenderId: "208087128442",
  appId: "1:208087128442:web:0702a72b852086ed011ec3",
};

firebase.initializeApp(config);

const db = firebase.firestore();

db.settings({
  timestampsInSnapshots: true,
});

//////////////// Staff information display /////////////////
// push pins into array for pin validation
let pins = [];
let pinInUse = false;

db.collection("staff")
  .orderBy("name")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        pins.push(change.doc.data().pin);
      }
    });
  });

// add value of inputs to db
$("#addNewStaffBtn").click(function (event) {
  event.preventDefault();
  if (
    $("#firstName").val() === "" ||
    $("#lastName").val() === "" ||
    $("#newPin").val() === ""
  ) {
    alert("Enter each field correctly.");
  } else {
    let firstName = $("#firstName").val();
    let lastName = $("#lastName").val();
    let pinNumber = $("#newPin").val();
    for (let i = 0; i < pins.length; i++) {
      if (pinNumber === pins[i]) {
        pinInUse = true;
      }
    }
    if (pinInUse) {
      alert("Duplication of Pin. Enter a new pin.");
      pinInUse = false;
    } else {
      db.collection("staff").add({
        name: firstName + " " + lastName,
        pin: pinNumber,
      });

      // reset form
      $("#firstName").val("");
      $("#lastName").val("");
      $("#newPin").val("");
    }
  }
});

// function to display staff's information
function renderStaff(doc) {
  let data = doc.data();
  let tbodyRef = $("#displayStaffInfo");
  let tbodyStaffDisplay = document.createElement("tbody");
  let tr = document.createElement("tr");
  let tdFirstName = document.createElement("td");
  let tdLastName = document.createElement("td");
  let tdPin = document.createElement("td");

  // set id to tr
  tr.setAttribute("data-id", doc.id);
  tbodyRef.append(tr);

  // set names and pin to td
  tdFirstName.innerHTML = doc.data().name.split(" ")[0];
  tdLastName.innerHTML = doc.data().name.split(" ")[1];
  tdPin.innerHTML = doc.data().pin;
  tr.append(tdFirstName);
  tr.append(tdLastName);
  tr.append(tdPin);
}

//////////////// Time Clock Sheet ////////////////
// get times in and out
function getTime(doc) {
  let data = doc.data();
  // console.log(data.Oct292018)
  $(".timeIn").change(function () {
    console.log("Moved");
  });
}
// create element and render staff to time sheet
function renderStaffTime(doc) {
  let data = doc.data();
  console.log(data);
  let timeCardBodyRef = $(".tableContent");
  // timeCardBodyRef.empty()
  // create table row with unquie ID
  let tr = document.createElement("tr");
  timeCardBodyRef.append(tr);

  /////// staff name ///////////
  // get name and append to th
  let staffName = document.createElement("td");
  staffName.setAttribute("class", "staffName");
  staffName.setAttribute("data-id", doc.id);
  staffName.innerHTML = data.name;
  tr.append(staffName);

  /////// display week ///////////
  let monthArray = [];
  let nameArray = [];
  for (let i = 0; i < 5; i++) {
    monthArray.push(weekArray[i]["month"]);
  }
  numberToMonth(monthArray[0], nameArray);
  numberToMonth(monthArray[1], nameArray);
  numberToMonth(monthArray[2], nameArray);
  numberToMonth(monthArray[3], nameArray);
  numberToMonth(monthArray[4], nameArray);

  for (let i = 0; i < 5; i++) {
    let tdDay = document.createElement("td");
    tdDay.setAttribute("class", "dayOfWeek");
    // table head for in and out text
    let tableDay = document.createElement("table");
    let theadDay = document.createElement("thead");
    let trInOutHeading = document.createElement("tr");
    trInOutHeading.setAttribute("class", "staffTimeHead");
    trInOutHeading.innerHTML = "<th>In</th><th>Out</th><th>Total</th>";
    theadDay.append(trInOutHeading);
    tableDay.append(theadDay);
    tdDay.append(tableDay);
    tr.append(tdDay);
    let timeTbody = document.createElement("tbody");
    let timeTr = document.createElement("tr");
    let inTd = document.createElement("td");
    inTd.setAttribute("class", "timeIn");

    let outTd = document.createElement("td");
    outTd.setAttribute("class", "timeOut");

    let times = data[nameArray[i] + weekArray[i]["day"] + weekArray[i]["year"]];
    let loggedTime = [];
    for (const key in times) {
      if (times.hasOwnProperty(key)) {
        loggedTime.push(times[key]);
      }
    }
    const staffTimeIn = moment(parseInt(loggedTime[0])).format("hh:mm:ss a");
    const staffTimeOut = moment(parseInt(loggedTime[1])).format("hh:mm:ss a");

    if (staffTimeIn !== "Invalid date") {
      inTd.append(staffTimeIn);
    } else {
      inTd.append("");
    }

    if (staffTimeOut !== "Invalid date") {
      outTd.append(staffTimeOut);
    } else {
      outTd.append("");
    }

    let totalTd = document.createElement("td");
    totalTd.setAttribute("class", "timeTotal");
    if (staffTimeIn !== "Invalid date" && staffTimeOut !== "Invalid date") {
      totalTime = parseInt(loggedTime[1]) - parseInt(loggedTime[0]);
      totalTd.append(moment(parseInt(totalTime)).format("mm:ss"));
    } else {
      totalTd.append("");
    }

    timeTr.append(inTd);
    timeTr.append(outTd);
    timeTr.append(totalTd);
    timeTbody.append(timeTr);
    tableDay.append(timeTbody);
    tdDay.append(tableDay);
    tr.append(tdDay);
  }
}

// render staff name and staff in and out times
db.collection("staff")
  .orderBy("name")
  .onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        // console.log(change.doc.id)
        renderStaff(change.doc);
        renderStaffTime(change.doc);
        getTime(change.doc);
      }
    });
  });

function displayStaffTime() {
  db.collection("staff").onSnapshot((snapshot) => {
    let changes = snapshot.docChanges();
    changes.forEach((change) => {
      if (change.type == "added") {
        // table for staff times
        renderStaffTime(change.doc);
      }
    });
  });
}
function numberToMonth(number, nameArray) {
  for (let i = 0; i < monthAbr.length; i++) {
    if (parseInt(number) === i + 1) {
      number = monthAbr[i];
      nameArray.push(monthAbr[i]);
    }
  }
}

// button click
$("#leftArrowBtn").on("click", function () {
  $(".tableContent").empty();
  backWeek();
  //   getDates();
  displayStaffTime();
});
$("#rightArrowBtn").on("click", function () {
  $(".tableContent").empty();
  forwardWeek();
  //   getDates();
  displayStaffTime();
});
$("#todayBtn").on("click", function () {
  $(".tableContent").empty();
  getCurrent();
  //   getDates();
  displayStaffTime();
});
