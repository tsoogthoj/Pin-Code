// Navigation
$('#nav-timeClockSheet-tab').click(function() {

    $('#nav-staff').fadeOut()
    setTimeout(function() {
        $('#nav-timeClockSheet').fadeIn()
    }, 500)

})

$('#nav-staff-tab').click(function() {

    $('#nav-timeClockSheet').fadeOut()
    setTimeout(function() {
        $('#nav-staff').fadeIn()
    }, 500)
})

// date picker


// limit pin input to 4
var max_chars = 4;

$('#newPin').keydown( function(e){
    if ($(this).val().length >= max_chars) { 
        $(this).val($(this).val().substr(0, max_chars));
    }
});

$('#newPin').keyup( function(e){
    if ($(this).val().length >= max_chars) { 
        $(this).val($(this).val().substr(0, max_chars));
    }
});

// Toggle change of text - expand/collase
$('#toggleAddStaffForm').click(function() {
    let toggle = $('#toggleAddStaffForm').attr('aria-expanded');
    if (toggle === 'false') {
        $('#toggleText').text(' (Click to collapse)')
    }
    if (toggle === 'true') {
        $('#toggleText').text(' (Click to expand)')
    }
})


// Initialize Firebase
var config = {
    apiKey: "AIzaSyDixWv9uLD8cMkTSjZ6CWxK1PIhgli_VyY",
    authDomain: "time-clock-38dfc.firebaseapp.com",
    databaseURL: "https://time-clock-38dfc.firebaseio.com",
    projectId: "time-clock-38dfc",
    storageBucket: "time-clock-38dfc.appspot.com",
    messagingSenderId: "267709784938"
};

firebase.initializeApp(config);

const db = firebase.firestore();

db.settings({
    timestampsInSnapshots: true
});

// add value of inputs to db
$('#addNewStaffBtn').click( function(event) {
    event.preventDefault();
    
    if ($('#firstName').val() === '' || $('#lastName').val() === ''|| $('#newPin').val() === '') {

    } else {
        
        let firstName = $('#firstName').val();
        let lastName = $('#lastName').val();
        let pinNumber = $('#newPin').val();
        

        
        db.collection("staff").add({
            name: firstName + ' ' + lastName,
            pin: pinNumber
        })

        // reset form
        $('#firstName').val('');
        $('#lastName').val('');
        $('#newPin').val('');
    }
})


// create element and render staff to staff
function renderStaff(doc) {
    tr = document.createElement('tr');
    tr.setAttribute('data-id', doc.id);

    let first = doc.data().name.split(' ')[0];
    let last = doc.data().name.split(' ')[1];
    tr.innerHTML = "<td>" + doc.data().name.split(' ')[0] + "</td><td>" + doc.data().name.split(' ')[1] + "</td><td>" + doc.data().pin + "</td>"
    $('#displayStaffInfo').append(tr);
}

// create element and render staff to time sheet
function renderStaffTime(doc) {
    let data = doc.data();

    let timeCardBodyRef = $('#timeCardBody');

    // create table row with unquie ID 
    let tr = document.createElement('tr');
    tr.setAttribute('data-id', doc.id);

    // get name and append to th
    let firstTh = document.createElement('th');
    firstTh.innerHTML = doc.data().name;
    tr.append(firstTh);

    // get clock in time and append to table
    let secondTh = document.createElement('th');
    let table = document.createElement('table');
    let firstTr = document.createElement('tr');
    let secondTr = document.createElement('tr');

        // format time
        let timeIn = data['10-17-2018'][0]
        timeIn = moment(timeIn).format('hh:mm:ss a')
        let timeOut = data['10-17-2018'][0]
        timeOut = moment(timeOut).format('hh:mm:ss a');
        let timeTotal = data['10-17-2018'][1] - data['10-17-2018'][0]
        timeTotal = moment(timeTotal).format('mm:ss')

        firstTr.innerHTML = '<th>In</th><th>Out</th><th>Total</th>';
        secondTr.innerHTML = '<td>' + timeIn + '</td><td>' + timeOut + '</td><td>' + timeTotal + ' min</td>';

        table.append(firstTr)
        table.append(secondTr)

        secondTh.append(table)
        tr.append(secondTh)

    // append everything to table
    timeCardBodyRef.append(tr);
}


// get data from db
db.collection('staff').orderBy('name').onSnapshot(snapshot => {
    let changes = snapshot.docChanges();
    changes.forEach(change => {
        // get first name
        if(change.type == 'added'){
            renderStaff(change.doc);
        }
        renderStaffTime(change.doc)
    });
});


db.collection("staff").get().then(function(querySnapshot) {
    let staffId = []
    querySnapshot.forEach(function(doc) {
        doc.data()
        staffId.push(doc.data().pin)
    });
});


// Calendar
const currentTime = moment();
const startOfWeekMon = parseInt(currentTime.startOf('week').format('DD')) + 1;
const endOfWeekFri = parseInt(moment().endOf('week').format('DD')) - 1;
const currentMonth = moment().format('MM');
const currentYear = moment().format('YYYY')
const monthAbr = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug", "Sep", "Oct", "Nov", "Dec"];
let daysInMonth;
let startingDay = 1;
let weekArray = {
    0: {
        month: 10,
        day: 1,
        year: 2018,
    },
    1: {
        month: 10,
        day: 1,
        year: 2018,
    },
    2: {
        month: 10,
        day: 1,
        year: 2018,
    },
    3: {
        month: 10,
        day: 1,
        year: 2018,
    },
    4: {
        month: 10,
        day: 5,
        year: 2018,
    },
}

// display weekdays
function displayWeekdays() {
    let displayText = []
    for (let i = 0; i < 5; i++) {
        displayText.push(" - " + weekArray[i]['day'])
    }
    $('.mon').children('span').text(displayText[0])
    $('.tue').children('span').text(displayText[1])
    $('.wed').children('span').text(displayText[2])
    $('.thu').children('span').text(displayText[3])
    $('.fri').children('span').text(displayText[4])

}


// get number of days of month
let numberOfDays = function(year, month) {
    daysInMonth = moment(year + '-' + month).daysInMonth()
}
// increase days and check for going into next month
let increaseDays = function() {
    for (let i = 0; i < 5; i++) {
        weekArray[i]['day'] = weekArray[0]['day'] + i
        weekArray[i]['month'] = weekArray[0]['month']
        weekArray[i]['year'] = weekArray[0]['year']
        // check for going into next month
        if (weekArray[i]['day'] > daysInMonth) {
            numberOfDays(weekArray[i]['year'], weekArray[i]['month'])
            weekArray[i]['month'] = parseInt(weekArray[i]['month']) + 1
            // going to next year
                if (parseInt(weekArray[i]['month']) === 13) {
                    weekArray[i]['month'] = 1
                    weekArray[i]['year'] = parseInt(weekArray[i]['year']) + 1
                }
            weekArray[i]['day'] = startingDay
            startingDay++
        }
        if (parseInt(weekArray[i]['month']) === 13) {
            weekArray[i]['month'] = 1
            weekArray[i]['year'] = weekArray[i]['year'] + 1
        }
        if (parseInt(weekArray[i]['month']) === 0) {
            weekArray[i]['month'] = 12
            weekArray[i]['year'] = weekArray[i]['year'] - 1
        }
    }
    startingDay = 1;
}


// Display Week
function displayDates() {
    let firstMonth = weekArray[0]['month']
    // change month number to month abbreviation
    for (let i = 0; i < monthAbr.length; i++) {
        if (firstMonth.toString() === (i + 1).toString()) {
            firstMonth = monthAbr[i]
        }
    }

    let monday = weekArray[0]['day']
    let firstYear = ", " + weekArray[0]['year']
    let secondMonth = weekArray[4]['month']
    // change month number to month abbreviation
    for (let i = 0; i < monthAbr.length; i++) {
        if (secondMonth.toString() === (i + 1).toString()) {
            secondMonth = monthAbr[i]
        }
    }

    let friday = weekArray[4]['day']
    let secondYear = ", " + weekArray[4]['year']
    // check same year
    if (weekArray[0]['year'] === weekArray[4]['year']) {
        firstYear = ''
    }
    // check same month
    if (weekArray[0]['month'] === weekArray[4]['month']) {
        secondMonth = ''
    }
    $('.navDateRange').text(firstMonth + " " + monday + firstYear + " - " + secondMonth + " " + friday + secondYear)
    displayWeekdays()
}

// go back one week
function backWeek() {
    weekArray[0]['day'] = weekArray[0]['day'] - 7
    // Monday
    if (parseInt(weekArray[0]['day']) < 0) {
        numberOfDays(weekArray[0]['year'], parseInt(weekArray[0]['month']) - 1)
        weekArray[0]['day'] = parseInt(daysInMonth) + parseInt(weekArray[0]['day'])
        weekArray[0]['month'] = parseInt(weekArray[0]['month']) - 1
    }

    if (parseInt(weekArray[0]['day']) === 0) {
        weekArray[0]['month'] = parseInt(weekArray[0]['month']) - 1
        if (parseInt(weekArray[0]['month']) === 0) {
            weekArray[0]['month'] = 12
            weekArray[0]['year'] = parseInt(weekArray[0]['year']) - 1
        }
        numberOfDays(weekArray[0]['year'], weekArray[0]['month'])
        weekArray[0]['day'] = daysInMonth
    }
    increaseDays()
    displayDates()
}

// go forward one week
function forwardWeek() {
    weekArray[0]['day'] = weekArray[0]['day'] + 7
    numberOfDays(weekArray[0]['year'], weekArray[0]['month'])

    if (parseInt(weekArray[0]['day']) > daysInMonth) {
        weekArray[0]['day'] = weekArray[0]['day'] - daysInMonth
        weekArray[0]['month'] = parseInt(weekArray[0]['month']) + 1
    }
    
    increaseDays()
    displayDates()
}

// get the current week
let getCurrent = function() {
    for (let i = 0; i < 5; i++) {
        weekArray[i]['month'] = currentMonth
    }
    weekArray[0]['day'] = startOfWeekMon
    increaseDays()
    displayDates()
    displayWeekdays()
}   
getCurrent()

// button click
$('#leftArrowBtn').on('click', function() {
    backWeek()
})
$('#rightArrowBtn').on('click', function() {
    forwardWeek()
})
$('#todayBtn').on('click', function() {
    getCurrent();
})

// moment().date() = #(1-5)
// 1 = mom / 2 = tue / 3 = wed / 4 = thu / 5 = fri 