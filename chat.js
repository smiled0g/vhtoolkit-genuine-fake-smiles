var getTicks = function() {
	return new Date().getTime() + '-' + Math.floor(Math.random()*10000000);
}

var getAnimations = function(animations) {
	return animations.map(function(anim) {
		anim = anim.concat([undefined, undefined]);
		return `<animation priority="5" ${anim[1]?`start="${anim[1]}"`:""} ${anim[2]?`end="${anim[2]}"`:""} name="${anim[0]}" />`;
	}).join('');
}

var getFaces = function(faces) {
	return faces.map(function(face) {
		face = face.concat([undefined, undefined]);
		return `<face type="FACS" au="${face[0]}" amount="${face[1]}" ${face[2]?`start="${face[2]}"`:""} ${face[3]?`end="${face[3]}"`:""} />`;
	}).join('');
}

var express = function(character, speech, time, faces, animations) {
	return `vrSpeak ${character} user ${time}
<?xml version="1.0" encoding="utf-16"?>
<act>
    <participant id="${character}" role="actor" />
    <bml>
        <speech id="sp1" ref="${character}_speech" type="application/ssml%2bxml">${speech}</speech>
				${getFaces(faces)}
				${getAnimations(animations)}
    </bml>
</act>`;
}

$(document).ready(function() {
	var client, destination, scope;

	if (!String.prototype.trim) {
		String.prototype.trim=function(){return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');};
	}

	$('#connect_form').submit(function() {
		var url = $("#connect_url").val();
		url = "ws://" + url + ":61614/stomp";
		scope = $("#scope").val();
		destination = "/topic/" + scope;

		client = Stomp.client(url);

		// this allows to display debug logs directly on the web page
		client.debug = function(str) {
			$("#debug").append(str + "\n");
		};
		// the client is notified when it is connected to the server.
		var onconnect = function(frame) {
			client.debug("connected to Stomp");
			$('#connect').fadeOut({ duration: 'fast' });
			$('#disconnect').fadeIn();
			$('#send_form').fadeIn();

			client.subscribe(destination, function(message) {
				// here the message arrives
				$("#messages").append("<p>" + message.body + "</p>\n");
			});

		};
		client.connect("guest", "guest", onconnect);

		return false;
	});

	$('#disconnect_form').submit(function() {
		client.disconnect(function() {
			$('#disconnect').fadeOut({ duration: 'fast' });
			$('#connect').fadeIn();
			$('#send_form').hide();
		});
		return false;
	});

	function sendMsg(text, delay) {
		delay = delay || 0;
		if (text) {
			text = text.trim();
			var arr   = text.split(" ");
			var first = arr.shift();
			setTimeout(function(){ client.send(destination, {ELVISH_SCOPE: scope, MESSAGE_PREFIX:first}, text); }, delay);
		}
	}

	window.sendMsg = sendMsg;

	$('#send_fake_smile_welcome').click(sendFakeSmile);
	$('#send_genuine_smile_welcome').click(sendGenuineSmile);
});

function sendFakeSmile() {
	// Rachel Pre-speech
	sendMsg(
		express(
			'Rachel',
			'',
			getTicks(),
			[
				[1, 0.5, 0.1, 1],
				[1, 0.85, 1, 4],
				[12, 1.4, 0.1, 3.7]
			],
			[
				["ChrBrad@Idle01_MeLf01"]
			]
		),
		0
	);

	// Brad 1
	sendMsg(
		express(
			'Brad',
			'Hello, my name is Brad.',
			getTicks(),
			[
				[1, 0.5, 0.1, 2],
				[1, 1.2, 2, 6],
				[12, 2, 0.1, 6]
			],
			[
				["ChrBrad@Idle01_IndicateRightRt01"],
				["ChrBrad@Idle01_Think01", 3]
			]
		),
		200
	);

	// Rachel 1
	sendMsg(
		express(
			'Rachel',
			'My name is Rachel, very nice to meet you.',
			getTicks(),
			[
				[1, 0.5, 0.1, 2],
				[1, 1.5, 2, 5],
				[12, 1.4, 0.1, 5]
			],
			[
				["ChrBrad@Idle01_ExampleLf01"],
				["ChrBrad@Idle01_ArmStretch01", 2]
			]
		),
		3000
	);

	// Brad 2
	sendMsg(
		express(
			'Brad',
			'Nice to meet you.',
			getTicks(),
			[
				[1, 0.5, 0.1, 2],
				[1, 1, 2, 7],
				[12, 2, 0.1, 6]
			],
			[
				["ChrBrad@Idle01_OfferBoth01"],
			]
		),
		7000
	);
}

function sendGenuineSmile() {
	// Rachel Pre-speech
	sendMsg(
		express(
			'Rachel',
			'',
			getTicks(),
			[
				[1, 0.5, 0.1, 1],
				[1, 0.85, 1, 1.5],
				[12, 0.8, 0.1, 1.5]
			],
			[
				["ChrBrad@Idle01_WeightShift02"]
			]
		),
		0
	);

	// Brad 1
	sendMsg(
		express(
			'Brad',
			'Hello, my name is Brad.',
			getTicks(),
			[
				[1, 0.5, 0.1, 2],
				[1, 1, 2, 4],
				[12, 1, 0.1, 4]
			],
			[
				["ChrBrad@Idle01_IndicateRightRt01"],
				["ChrBrad@Idle01_Think01", 3]
			]
		),
		200
	);

	// Rachel 1
	sendMsg(
		express(
			'Rachel',
			'My name is Rachel, very nice to meet you.',
			getTicks(),
			[
				[1, 0.5, 0.1, 2],
				[1, 1, 2, 5],
				[12, 1, 0.1, 5]
			],
			[
				["ChrBrad@Idle01_ExampleLf01"],
				["ChrBrad@Idle01_TouchHands01", 2]
			]
		),
		3000
	);

	// Brad 2
	sendMsg(
		express(
			'Brad',
			'Nice to meet you.',
			getTicks(),
			[
				[1, 0.9, 0.1, 2],
				[1, 1.3, 2, 3],
				[12, 1.5, 0.1, 3]
			],
			[
				["ChrBrad@Idle01_ChopLf01"],
			]
		),
		7000
	);
}
