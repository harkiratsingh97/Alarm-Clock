//Return the time in Printable form for Clock
function timePrintableForm(hour, minute, second) {
	let zone = "AM";
	if (hour >= 12) {
		zone = "PM";
		hour = hour == 12 ? hour : hour - 12;
	}
	hour = hour == 0 ? 12 : hour < 10 ? "0" + hour : hour;
	minute = minute < 10 ? "0" + minute : minute;
	second = second < 10 ? "0" + second : second;
	return { hour, minute, second, zone };
}

//This is an interval for running clock
setInterval(function () {
	const date = new Date();
	const { hour, minute, second, zone } = timePrintableForm(
		date.getHours(),
		date.getMinutes(),
		date.getSeconds()
	);
	document.getElementById(
		"time"
	).innerHTML = `${hour}:${minute}:${second} ${zone}`;
}, 1);

//This function validates the chosen time
function validateTime(hour, minute, second) {
	if (hour > 12 || minute > 59 || second > 59) {
		alert("Enter Valid time");
		return false;
	}
	return true;
}

//This will return the actual time in milliseconds for setting alarm
function actualTime(hour, minute, second, zone) {
	if (hour == 12) {
		if (zone == "AM") {
			hour = 0;
		}
	} else {
		if (zone == "PM") {
			hour = Number(hour);
			hour += 12;
		}
	}

	const newDate = new Date();
	newDate.setHours(hour);
	newDate.setMinutes(minute);
	newDate.setSeconds(second);
	return newDate.getTime();
}

//Storing all the setted alarms in the array
let alarms = [];

//This function is invoked to set a new Alarm
function setAlarm() {
	const form = document.getElementById("set-alarm");
	const formData = new FormData(form);
	const id = alarms.length + 1;
	const { hour, minute, second, zone } = {
		hour: formData.get("hour"),
		minute: formData.get("minute"),
		second: formData.get("second"),
		zone: formData.get("zone"),
	};

	if (!validateTime(hour, minute, second)) {
		return;
	}

	let actualAlarmTime = actualTime(hour, minute, second, zone);

	const curTime = new Date().getTime();
	let timeDiff = actualAlarmTime - curTime;

	let timeoutId;
	if (timeDiff < 0) {
		alert("Alarm cannot be earlier than Current Time");
		return;
	} else {
		const timeoutId = setTimeout(
			(id) => {
				alert("Alarm ringing now");
				// console.log(id)
				deleteAt(id);
			},
			timeDiff,
			id
		);
	}

	const alarmsContainer = document.getElementById("active-alarms-container");
	const newAlarm = document.createElement("div");
	newAlarm.classList.add("time", "row", "justify-content-between");
	newAlarm.id = id;
	newAlarm.innerHTML = `<div class='col-3 alarm-div'>${hour}:${minute}:${second} ${zone}</div><div class=col-3><button onclick=deleteAt(${id})>Delete</button></div>`;
	alarmsContainer.appendChild(newAlarm);

	alarms.push({ id, hour, minute, second, timeoutId });
}

//This function is to delete an alarm from the Alarm array and also clearing the interval so alarm does not go off after deletion
function deleteAt(id) {
	alarms.forEach((e) => {
		if (e.id == id) {
			clearTimeout(e.timeoutId);
		}
	});
	const toBeDeleted = document.getElementById(id);
	let alarmsContainer = document.getElementById("active-alarms-container");
	alarmsContainer.removeChild(toBeDeleted);
	alarms = alarms.filter((e) => e.id !== id);
}
