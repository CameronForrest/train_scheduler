// Initialize Firebase
var config = {
  apiKey: "AIzaSyCj4MNYFC7SBwaB82VGZBaOJIZeVwA2vBs",
  authDomain: "trainschedule-e8506.firebaseapp.com",
  databaseURL: "https://trainschedule-e8506.firebaseio.com",
  projectId: "trainschedule-e8506",
  storageBucket: "trainschedule-e8506.appspot.com",
  messagingSenderId: "440076453049"
};
firebase.initializeApp(config);

var database = firebase.database();

// Button for adding train to schedule
$("#add-train").on("click", function(event) {
event.preventDefault();

// Grabs user input
var trainName = $("#name-input").val().trim();
var destination = $("#destination-input").val().trim();
var firstTrain = moment($("#start-time").val().trim(), "HH:mm").format("HH:mm");
var frequency = $("#frequency").val().trim();

// Creates local "temporary" object for holding train data
var newTrain = {
  trainName: trainName,
  destination: destination,
  firstTrain: firstTrain,
  frequency: frequency
};

if (trainName === "" || destination === "" || firstTrain === "" || frequency === "") {
  alert("Train has not been added, fill out all of the options");
}
else {
  alert("Train has been added");

  // Uploads train data to the database
  database.ref().push(newTrain);

  // Logs everything to console
  console.log(newTrain.trainName);
  console.log(newTrain.destination);
  console.log(newTrain.firstTrain);
  console.log(newTrain.frequency);
}

// Clears all of the text-boxes
$("name-input").val("");
$("#destination-input").val("");
$("#start-time").val("");
$("#frequency").val("");
});

// Create Firebase event for adding train to the database and a row in the html when a user adds an entry
database.ref().on("child_added", function(childSnapshot) {
console.log(childSnapshot.val());

// Store everything into a variable.
var trainName = childSnapshot.val().trainName;
var destination = childSnapshot.val().destination;
var firstTrain = childSnapshot.val().firstTrain;
var frequency = childSnapshot.val().frequency;

// Train Info
console.log(trainName);
console.log(destination);
console.log(firstTrain);
console.log(frequency);

// 
var firstTimeConverted = moment(firstTrain, "HH:mm");
console.log(firstTimeConverted);
var currentTime = moment().format("HH:mm");
console.log("CURRENT TIME: " + currentTime);


// To calculate the next train arrival
var timeDiff = moment().diff(moment(firstTimeConverted), "minutes");
console.log("Difference in Time: " + timeDiff);
var timeRemainder = timeDiff % frequency;
console.log(timeRemainder)
var minToTrain = frequency - timeRemainder;
console.log(minToTrain)
var nextTrain = moment().add(minToTrain, "minutes").format("HH:mm");
console.log(nextTrain);

// conditional to check if first train has not yet run
if (timeRemainder < 0) {
    nextTrain = firstTrain;
    console.log(nextTrain);
    minToTrain = -timeDiff;
    console.log(minToTrain);
}

// Create the new row
var newRow = $("<tr>").append(
  $("<td>").text(trainName),
  $("<td>").text(destination),
  $("<td>").text(frequency),
  $("<td>").text(nextTrain),
  $("<td>").text(minToTrain),
);

// Append the new row to the table
$("#train-table > tbody").append(newRow);
});