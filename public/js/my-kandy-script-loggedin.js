// Setup Kandy to make and receive calls.
kandy.setup({
    // Designate HTML elements to be our stream containers.
    remoteVideoContainer: document.getElementById("remote-container"),
    localVideoContainer: document.getElementById("local-container"),

    // Register listeners to call events.
    listeners: {
        callinitiated: onCallInitiated,
        callincoming: onCallIncoming,
        callestablished: onCallEstablished,
        callended: onCallEnded
    }
});



$(document).ready(function(){
//login fuction here
if(getStoredValue("LoggedIn")==="true" ){
$(".messages").removeClass('hidden');
$(".messages").fadeTo(2000, 500).slideUp(500, function(){
               $(".messages").alert('close');
                });
$("#username-loggedin").text(getStoredValue("username"));
} else {
    alert('Opp! You are not Logged in. Click OK to go to login page!');
    window.location.replace("http://localhost/Kandy/HelloWolrd/index.html");
}




});

// function store the state of user login or not

function storeValue(key, value) {
    if (localStorage) {
        localStorage.setItem(key, value);
    } else {
        $.cookies.set(key, value);
    }
}

//fuction get the stored value

function getStoredValue(key) {
    if (localStorage) {
        return localStorage.getItem(key);
    } else {
        return $.cookies.get(key);
    }
}


function toggleLogin(){
    var projectAPIKey = "DAK6b28f73c4a2f47649e9bd229107d1bbc";
var username = $("#username").val();
var password = $("#pwd").val();

    console.log('passed');
    console.log(username);
    console.log(password);

if(isLoggedIn) {
       kandy.logout(onLogoutSuccess);
   } else {
       kandy.login(projectAPIKey, username, password, onLoginSuccess, onLoginFailure);
   }
}
//logout

function toggleLogout(){
kandy.logout(onLogoutSuccess);
}



function log(message) {
    $("#messages").text(message);
    if (message==="Login-successful"){
        $(".messagesFailed").addClass('hidden');
        $(".loginform").addClass('hidden');
        $(".loggedin").removeClass('hidden');
        $(".messages").removeClass('hidden');
        $(".messages").text(message);
        $("#username-loggedin").text($("#username").val());
        $(".messages").fadeTo(2000, 500).slideUp(500, function(){
               $(".messages").removeClass('hidden');
                }); 
    } else if(message==="Logout-successful"){
        $(".messages").addClass('hidden');
        $(".messagesOut").removeClass('hidden');
        $(".messagesOut").text(message);
    } else {
        $(".messagesOut").addClass('hidden');
         $(".messagesFailed").removeClass('hidden');
        $(".messagesFailed").text(message);
    }
}

// What to do on a successful login.
function onLoginSuccess() {
    log("Login-successful");

    
    isLoggedIn = true;
    window.location.replace("http://localhost/Kandy/HelloWolrd/loggedIn.html");
}

// What to do on a failed login.
function onLoginFailure() {
    log("Login-failed");
}

// What to do on a succesful logout.
function onLogoutSuccess() {
    storeValue("LoggedIn", "false");
    log("Logout-successful");
    isLoggedIn = false;
    window.location.replace("http://localhost/Kandy/HelloWolrd/index.html");
     $(".loginform").removeClass('hidden');
    $(".loggedin").addClass('hidden');

}


// Variable to keep track of video display status.
var showVideo = true;

// Get user input and make a call to the callee.
function startCall() {
    var callee = document.getElementById("callee").value;

    // Tell Kandy to make a call to callee.
    kandy.call.makeCall(callee, showVideo);
}

// Variable to keep track of the call.
var callId;

// What to do when a call is initiated.
function onCallInitiated(call, callee) {
    log("Call initiated with " + callee + ". Ringing...");

    // Store the call id, so the caller has access to it.
    callId = call.getId();

    // Handle UI changes. A call is in progress.
    document.getElementById("make-call").disabled = true;
    document.getElementById("end-call").disabled = false;
}

// What to do for an incoming call.
function onCallIncoming(call) {
    log("Incoming call from " + call.callerNumber);

    // Store the call id, so the callee has access to it.
    callId = call.getId();

    // Handle UI changes. A call is incoming.
    document.getElementById("accept-call").disabled = false;
    document.getElementById("decline-call").disabled = false;
}

// Accept an incoming call.
function acceptCall() {
    // Tell Kandy to answer the call.
    kandy.call.answerCall(callId, showVideo);
    // Second parameter is false because we are only doing voice calls, no video.

    log("Call answered.");
    // Handle UI changes. Call no longer incoming.
    document.getElementById("accept-call").disabled = true;
    document.getElementById("decline-call").disabled = true;
}

// Reject an incoming call.
function declineCall() {
    // Tell Kandy to reject the call.
    kandy.call.rejectCall(callId);

    log("Call rejected.");
    // Handle UI changes. Call no longer incoming.
    document.getElementById("accept-call").disabled = true;
    document.getElementById("decline-call").disabled = true;
}

// What to do when call is established.
function onCallEstablished(call) {
    log("Call established.");

    // Handle UI changes. Call in progress.
    document.getElementById("make-call").disabled = true;
    document.getElementById("mute-call").disabled = false;
    document.getElementById("hold-call").disabled = false;
    document.getElementById("end-call").disabled = false;
}

// What to do when a call is ended.
function onCallEnded(call) {
    log("Call ended.");

    // Handle UI changes. No current call.
    document.getElementById("make-call").disabled = false;
    document.getElementById("mute-call").disabled = true;
    document.getElementById("end-call").disabled = true;
}

// End a call.
function endCall() {
    // Tell Kandy to end the call.
    kandy.call.endCall(callId);
}

// Variable to keep track of mute status.
var isMuted = false;

// Mute or unmute the call, depending on current status.
function toggleMute() {
    if(isMuted) {
        kandy.call.unMuteCall(callId);
        log("Unmuting call.");
        isMuted = false;
    } else {
        kandy.call.muteCall(callId);
        log("Muting call.");
        isMuted = true;
    }
}

// Variable to keep track of hold status.
var isHeld = false;

// Hold or unhold the call, depending on current status.
function toggleHold() {
    if(isHeld) {
        kandy.call.unHoldCall(callId);
        log("Unholding call.");
        isHeld = false;
    } else {
        kandy.call.holdCall(callId);
        log("Holding call.");
        isHeld = true;
    }
}

// What to do when a call is ended.
function onCallEnded(call) {
    log("Call ended.");

    // Handle UI changes. No current call.
    document.getElementById("make-call").disabled = false;
    document.getElementById("mute-call").disabled = true;
    document.getElementById("hold-call").disabled = true;
    document.getElementById("end-call").disabled = true;

    // Call no longer active, reset mute and hold statuses.
    isMuted = false;
    isHeld = false;
}


// Show or hide video, depending on current status.
function toggleVideo() {
    if(showVideo) {
        kandy.call.stopCallVideo(callId);
        log("Stopping send of video.");
        showVideo = false;
    } else {
        kandy.call.startCallVideo(callId);
        log("Starting send of video.");
        showVideo = true;
    }
}
