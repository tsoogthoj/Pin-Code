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

let input = '';
let correct = [];

// Pin System 
let correctSound = new Audio('audio/correct.mp3')
correctSound.loop = false
let wrongSound = new Audio('audio/wrong.mp3')
wrongSound.loop = false


db.collection("staff").get().then(function(querySnapshot) {
	let staffPin = []
	let staffNames = []
	let idTag = []
    querySnapshot.forEach(function(doc) {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
		staffPin.push(doc.data().pin)
		staffNames.push(doc.data().name)
		idTag.push(doc.id)
	});
	// console.log(idTag)
	// console.log(staffNames);

// Click
	$('.number').click(function() {
		selected = $(this)
		input += $(this).text()
		// console.log(input)
		// console.log(input.length)
		$(this).css("border","1px solid white")
		$(this).css('background', 'gray')
		setTimeout(function() {
			selected.css("border","1px solid gray")
			selected.css('background', '#212121')
		},200)
		if (input.length === 1) {
			$('.dot1').css('background','white')
		}
		if (input.length === 2) {
			$('.dot2').css('background','white')
		}
		if (input.length === 3) {
			$('.dot3').css('background','white')
		}
		if (input.length === 4) {
			$('.dot4').css('background','white')
			let found = 0;
			let currentId = '';
			for (let i = 0; i < staffPin.length; i++) {
				if (input === staffPin[i]) {
					currentId = idTag[i]
					// console.log('found')
					found = 1;
					break
				}
			}
			// console.log(currentId)
			if (found) {
				todayDate = moment().format('MM-DD-YYYY');
				todayMonth = moment().format('MM')
				// console.log(todayMonth)
				time = moment().valueOf();
				// console.log(time);

				db.collection("staff").doc(currentId).update({
					[todayDate]: firebase.firestore.FieldValue.arrayUnion(time)
				})
				db.collection("month").doc(todayMonth).update({
					day: firebase.firestore.FieldValue.arrayUnion('10-17-2018')
				})

				correctSound.play();
				$('body').addClass('correct');
				setTimeout(function() {
					$('body').removeClass('correct')
				},500)
			} else {
				wrongSound.play()
				$('body').addClass('wrong')
				setTimeout(function() {
					$('body').removeClass('wrong')
				},500)
			}
			
			setTimeout(function() {
				input = '';
				$('.dot').css('background','rgba(255, 255, 255, 0.5)')
			},500)
		}
	})

// db
});

