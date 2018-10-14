let input = '';
let correct = '1111'
let correctSound = new Audio('audio/correct.mp3')
correctSound.loop = false
let wrongSound = new Audio('audio/wrong.mp3')
wrongSound.loop = false

$('.number').click(function() {
	selected = $(this)
	input += $(this).text()
	console.log(input)
	console.log(input.length)
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
		if (input === correct) {
			console.log(moment().format('HH:mm:ss'))
			correctSound.play()
			$('body').addClass('correct')
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
