
// Initialize Firebase
  var config = {
    apiKey: "AIzaSyB-gxO_hwyBRje7G3EiYc9zxw5gyas8ztA",
    authDomain: "train-scheduler-a212c.firebaseapp.com",
    databaseURL: "https://train-scheduler-a212c.firebaseio.com",
    projectId: "train-scheduler-a212c",
    storageBucket: "train-scheduler-a212c.appspot.com",
    messagingSenderId: "746121116927"
  };
  firebase.initializeApp(config);

var database = firebase.database();

var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = 0;
var currentTime = moment();
var index = 0;


var datetime = null,
date = null;

var update = function () {
  date = moment(new Date())
  datetime.html(date.format('dddd, MMMM Do YYYY, h:mm:ss a'));
};

$(document).ready(function(){
  datetime = $('#current-status')
  update();
  setInterval(update, 1000);
});


$("#submit-button").on("click", function() {

  trainName = $("#trainName").val().trim();
  destination = $("#destination").val().trim();
  firstTrainTime = $("#firstTrainTime").val().trim();
  frequency = $("#frequency").val().trim();

  console.log(trainName);
  console.log(destination);
  console.log(firstTrainTime);
  console.log(frequency);
  
  
  var firstTimeConverted = moment(firstTrainTime, "hh:mm").subtract(1, "years");

  var diffTime = moment().diff(moment(firstTimeConverted), "minutes");

  var tRemainder = diffTime % frequency;

  var minutesAway = frequency - tRemainder;

  var nextTrain = moment().add(minutesAway, "minutes");
  

 
  var nextArrival = moment(nextTrain).format("hh:mm a");

  var nextArrivalUpdate = function() {
    date = moment(new Date())
    datetime.html(date.format('hh:mm a'));
  }

  database.ref().push({
    trainName: trainName,
    destination: destination,
    firstTrainTime: firstTrainTime,
    frequency: frequency,
    minutesAway: minutesAway,
    nextArrival: nextArrival,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
  
  alert("Form submitted!");

  // Empty text input
  $("#trainName").val("");
  $("#destination").val("");
  $("#firstTrainTime").val("");
  $("#frequency").val("");
  

  return false; 
});

  database.ref().orderByChild("dateAdded").limitToLast(20).on("child_added", function(snapshot) {


    console.log("Train name: " + snapshot.val().trainName);
    console.log("Destination: " + snapshot.val().destination);
    console.log("First train: " + snapshot.val().firstTrainTime);
    console.log("Frequency: " + snapshot.val().frequency);
    console.log("Next train: " + snapshot.val().nextArrival);
    console.log("Minutes away: " + snapshot.val().minutesAway);
    console.log("==============================");

    trainName = snapshot.val().trainName;
    destination = snapshot.val().destination;
    firstTrainTime = snapshot.val().firstTrainTime;
    frequency = snapshot.val().frequency;

 
  $("#newTrain").append("<tr><td>" + snapshot.val().trainName + "</td>" +
    "<td>" + snapshot.val().destination + "</td>" + 
    "<td>" + "Every " + snapshot.val().frequency + " mins" + "</td>" + 
    "<td>" + snapshot.val().nextArrival + "</td>" +
    "<td>" + snapshot.val().minutesAway + " mins until arrival" + "</td>" +
    "</td></tr>");

  index++;

  // Handle the errors
  }, function(errorObject) {
    console.log("Errors: " + errorObject.code);
  });
