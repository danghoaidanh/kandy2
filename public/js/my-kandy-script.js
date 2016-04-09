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
        callended: onCallEnded,
        // Media Event
        media: onMediaError,
        // Screensharing Event
        callscreenstopped: onStopSuccess,
        //message function
        message: onMessageReceived,
        //group chat-messages 
        chatGroupMessage: onChatGroupMessage,
        chatGroupInvite: onChatGroupInvite,
        chatGroupBoot: onChatGroupBoot,
        chatGroupUpdate: onChatGroupUpdate,
        chatGroupDelete: onChatGroupDelete
    },
    // Reference the default Chrome extension.
    chromeExtensionId: {
        chromeExtensionId: 'daohbhpgnnlgkipndobecbmahalalhcp'
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

var storeIndex = {
    isLoggedIn: "false"
};


$(document).ready(function () {
//login fuction here


});


function toggleLogin() {
    //var projectAPIKey = $("#projectApiKey").val();
    var projectAPIKey = "DAK4d50ed6211d14ef09ee27b942f652aca";
    var username = $("#username").val();
    var password = $("#pwd").val();
    storeValue("username", username);
    storeValue("pwd", password);
// show the groress of login
    $(".fa.fa-spinner.activate").removeClass("hidden");
    var isLoggedIn = false;
    console.log('passed');
    console.log(username);
    console.log(password);

    if (isLoggedIn) {
        kandy.logout(onLogoutSuccess);
    } else {
        kandy.login(projectAPIKey, username, password, onLoginSuccess, onLoginFailure);
    }
}
//logout

function toggleLogout() {
    $(".fa.fa-spinner.activate").addClass("hidden");
    kandy.logout(onLogoutSuccess);

}


function log(message) {
    $("#messages").text(message);
    if (message === "Login-successful") {
        $(".messagesFailed").addClass('hidden');
        $(".loginform").addClass('hidden');
        $(".loggedin").removeClass('hidden');
        $(".messages").removeClass('hidden');
        $(".messages").text(message);
        $("#username-loggedin-nav").text($("#username").val());
        $(".messages").fadeTo(2000, 500).slideUp(500, function () {
            $(".messages").removeClass('hidden');
        });
        $(".user-name-show").removeClass("hidden");
        $(".user-name-logout").removeClass("hidden")
    } else if (message === "Logout-successful") {
        $(".messagesFailed").addClass('hidden');
        $(".messages").addClass('hidden');
        $(".messagesOut").removeClass('hidden');
        $(".messagesOut").text(message);
        $(".user-name-logout").addClass("hidden");
        $(".user-name-show").addClass("hidden");
    } else {
        $(".messagesOut").addClass('hidden');
        $(".messagesFailed").removeClass('hidden');
        $(".messagesFailed").text(message);
    }
}

// What to do on a successful login.
function onLoginSuccess() {
    log("Login-successful");


    var isLoggedIn = true;
    storeValue("LoggedIn", "true");
    console.log('this is tesitng');

}

// What to do on a failed login.
function onLoginFailure() {
    log("Login-failed");
}

// What to do on a succesful logout.
function onLogoutSuccess() {
    log("Logout-successful");
    var isLoggedIn = false;

    $(".loginform").removeClass('hidden');
    $(".loggedin").addClass('hidden');

}


// Variable to keep track of video display status.
var showVideo = false;

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
    document.getElementById('screensharing').disabled = false;
}

// What to do when a call is ended.
function onCallEnded(call) {
    log("Call ended.");

    // Handle UI changes. No current call.
    document.getElementById("make-call").disabled = false;
    document.getElementById("mute-call").disabled = true;
    document.getElementById("end-call").disabled = true;
    document.getElementById('screensharing').disabled = true;
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
    if (isMuted) {
        kandy.call.unMuteCall(callId);
        log("Unmuting call.");
        isMuted = false;
        $(".mute").removeClass("hidden");
        $(".unmute").addClass("hidden");
    } else {
        kandy.call.muteCall(callId);
        log("Muting call.");
        isMuted = true;
        $(".unmute").removeClass("hidden");
        $(".mute").addClass("hidden");
    }
}

// Variable to keep track of hold status.
var isHeld = false;

// Hold or unhold the call, depending on current status.
function toggleHold() {
    if (isHeld) {
        kandy.call.unHoldCall(callId);
        log("Unholding call.");
        isHeld = false;
        $(".hold").removeClass("hidden");
        $(".unhold").addClass("hidden");
    } else {
        kandy.call.holdCall(callId);
        log("Holding call.");
        isHeld = true;
        $(".unhold").removeClass("hidden");
        $(".hold").addClass("hidden");
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
    if (showVideo) {
        kandy.call.stopCallVideo(callId);
        log("Stopping send of video.");
        showVideo = false;
        $(".showvideo").removeClass("hidden");
        $(".unshowvideo").addClass("hidden");
    } else {
        kandy.call.startCallVideo(callId);
        log("Starting send of video.");
        showVideo = true;
        $(".unshowvideo").removeClass("hidden");
        $(".showvideo").addClass("hidden");
    }
}

// Initialize Kandy's media support.
function init() {
    kandy.call.initMedia(onInitSuccess, onInitFailure);
}

// What to do on an init media success.
function onInitSuccess() {
    log("WebRTC supported.");
}

// What to do on an init media failure.
function onInitFailure(errorCode) {
    log("Initialization issue. Code: " + errorCode);
}

// Called when the media event is triggered.
function onMediaError(error) {

    switch (error.type) {
        case kandy.call.MediaErrors.WRONG_VERSION:
            log("Media plugin version not supported.");
            break;
        case kandy.call.MediaErrors.NEW_VERSION_WARNING:
            log("New plugin version available.");
            displayURLs(error);
            break;
        case kandy.call.MediaErrors.NOT_INITIALIZED:
            log("Media couldn't be initialized.");
            break;
        case kandy.call.MediaErrors.NOT_FOUND:
            log("No WebRTC support was found.");
            displayURLs(error);
            break;
        case kandy.call.MediaErrors.NO_SCREENSHARING_WARNING:
            log("WebRTC supported, but no screensharing support was found.");
            break;
    }
}
// Display the URLs so the user can download the version they need.
function displayURLs(error) {
    var win32 = error.urlWin32bit;
    var win64 = error.urlWin64bit;
    var macUnix = error.urlMacUnix;

    var element = "Please download the appropriate plugin for your machine:" +
        "<ul>" +
        "<li> <a href='" + win32 + "'>Windows 32bit</a> </li>" +
        "<li> <a href='" + win64 + "'>Windows 64bit</a> </li>" +
        "<li> <a href='" + macUnix + "'>Mac/Unix</a> </li>" +
        "</ul>";
    log(element);
}

// Keep track of screensharing status.
var isSharing = false;

// Executed when the user clicks on the 'Toggle Screensharing' button.
function toggleScreensharing() {
    // Check if we should start or stop sharing.
    if (callId && isSharing) {
        // Stop screensharing.
        console.log("this is actinv scrnee shrjer");
        $(".offscreensharing").removeClass("hidden");
        $(".onscreensharing").addClass("hidden");
        kandy.call.stopScreenSharing(callId, onStopSuccess, onStopFailure);
    } else {
        // Start screensharing.
        console.log("this is else scrnee shrjer");
        $(".onscreensharing").addClass("hidden");
        $(".offscreensharing").removeClass("hidden");
        kandy.call.startScreenSharing(callId, onStartSuccess, onStartFailure);
    }
}

// What to do on a successful screenshare start.
function onStartSuccess() {
    log('Screensharing started.');
    isSharing = true;
}

// What to do on a failed screenshare start.
function onStartFailure() {
    log('Failed to start screensharing.');
}

// What to do on a successful screenshare stop.
function onStopSuccess() {
    log('Screensharing stopped.');
    isSharing = false;
}

// What to do on a failed screenshare stop.
function onStopFailure() {
    log('Failed to stop screensharing.');
}


// Gathers the user's input and sends a message to the recipient.
function sendMessage() {
    var recipient = document.getElementById("recipient").value;
    var message = document.getElementById("messageBox").value;

    kandy.messaging.sendIm(recipient, message, onSendSuccess, onSendFailure);
}

// What to do on a successful send message.
function onSendSuccess(message) {
    // Display the message as outgoing.
    var recipient = message.destination.split("@")[0];
    // Create the message element. Use Lodash to escape the message for security purposes.
    var element = "<div>Outgoing (" + recipient + "): " + _.escape(message.message.text) + "</div>";
    document.getElementById("chat-messages").innerHTML += element;
}

// What to do on a failed send message.
function onSendFailure() {
    log("Send Message failed.");
}

/**
 * Called when the `message` event is triggered.
 * Receives the message object as a parameter.
 */
function onMessageReceived(message) {
    // Display the message as incoming.
    var sender = message.sender.user_id;
    // Create the message element. Use Lodash to escape the message for security purposes.
    var element = "<div>Incoming (" + sender + "): " + _.escape(message.message.text) + "</div>"
    document.getElementById("chat-messages").innerHTML += element;
}

//Group chat beginning
// Gather the user's input then creates a group.
function createGroup() {
    var name = document.getElementById("create-group-name").value;

    // Tell Kandy to create the group.
    kandy.messaging.createGroup(name, null, onCreateSuccess, onCreateFailure);
}

// What to do on a create group success.
function onCreateSuccess(group) {
    log("Group created: " + group.group_name + " (" + group.group_id + ").");
}

// What to do on a create group failure.
function onCreateFailure() {
    log("Failed to create group.");
}

// Gather the user's input then update the specified group.
function updateGroup() {
    var id = document.getElementById("update-group-id").value;
    var name = document.getElementById("update-group-name").value;

    // Tell Kandy to update the group.
    kandy.messaging.updateGroup(id, name, null, onUpdateSuccess, onUpdateFailure);
}

// What to do on an update group success.
function onUpdateSuccess(group) {
    log("Group updated: " + group.group_name + " (" + group.group_id + ").");
}

// What to do on an update group failure.
function onUpdateFailure() {
    log("Failed to update group.");
}


// Gather the user's input then delete the specified group.
function deleteGroup() {
    var id = document.getElementById("delete-group-id").value;

    // Tell Kandy to delete the group.
    kandy.messaging.deleteGroup(id, onDeleteSuccess, onDeleteFailure);
}

// What to do on a delete group success.
function onDeleteSuccess() {
    log("Group deleted.");
}

// What to do on a delete group failure.
function onDeleteFailure() {
    log("Failed to delete group.");
}

// Gather the user's input then join the specified group.
function addMembers() {
    var id = document.getElementById("add-group-id").value;
    var users = document.getElementById("add-members").value;

    // Kandy expects users as an array.
    users = users.split(", ");

    // Tell Kandy to add the users to the group.
    kandy.messaging.addGroupMembers(id, users, onAddSuccess, onAddFailure);
}

// What to do on an add member success.
function onAddSuccess(group) {
    log("Members added to group.");
}

// What to do on an add member failure.
function onAddFailure() {
    log("Failed to add members to group.");
}


// Gather the user's input then remove the specified members from the group.
function removeMembers() {
    var id = document.getElementById("remove-group-id").value;
    var users = document.getElementById("remove-members").value;

    // Kandy expects users as an array.
    users = users.split(", ");

    // Tell Kandy to remove the users from the group.
    kandy.messaging.removeGroupMembers(id, users, onRemoveSuccess, onRemoveFailure);
}

// What to do on a remove member success.
function onRemoveSuccess(group) {
    log("Members removed from group.");
}

// What to do on a remove member failure.
function onRemoveFailure() {
    log("Failed to remove members from group.");
}

// Gather the user's input then send a message to the group.
function sendMessageToGroup() {
    var id = document.getElementById("chat-group-id").value;
    var message = document.getElementById("chat-message").value;

    // Tell Kandy to send the message to the group.
    kandy.messaging.sendGroupIm(id, message, onSendSuccessG, onSendFailureG);
}


// What to do on an send message success.
function onSendSuccessG(message) {
    // Handle the message.
    var id = message.group_id;
    var messageText = message.message.text;
    // Create the message element. Use Lodash to escape the message to prevent security issues.
    var element = "<div>Me (" + id + "): " + _.escape(messageText) + "</div>";

    // Add the message to the chat messages div.
    document.getElementById("g-chat-messages").innerHTML += element;
}

// What to do on a send message failure.
function onSendFailureG() {
    log("Failed to send group message.");
}


// Get groups the user is a member of.
function getGroups() {
    // Tell Kandy to get groups.
    kandy.messaging.getGroups(onGetGroupsSuccess, onGetGroupsFailure);
}


// What to do on a get groups success.
function onGetGroupsSuccess(result) {
    // Get the element we'll be displaying groups in.
    var groupElement = document.getElementById("group-info");
    // Clear any current info in the element and start a new list.
    groupElement.innerHTML = "Groups: <ul>";

    // Iterate over the groups and display basic info about them.
    result.groups.forEach(function (group) {
        var id = group.group_id;
        var name = group.group_name;
        var memberCount = group.owners.length + group.members.length;

        var element = "<li>Group ID: " + id + ". Name: " + name + ". Members: " + memberCount + ".</li>";
        groupElement.innerHTML += element;
    });
    // Close the list.
    groupElement.innerHTML += "</ul>";
}

// What to do on a get groups failure.
function onGetGroupsFailure() {
    log("Failed to get groups.");
}

// Gather the user's input then get the specified group.
function getInfo() {
    var id = document.getElementById("info-group-id").value;

    // Tell Kandy to get the group.
    kandy.messaging.getGroupById(id, onGetInfoSuccess, onGetInfoFailure);
}


// What to do on a get info success.
function onGetInfoSuccess(group) {
    var groupElement = document.getElementById("group-info");

    // Get the element we'll be displaying groups in.
    var groupElement = document.getElementById("group-info");
    // Clear any current info in the element.
    groupElement.innerHTML = "Group Info:";

    // Create an element for group information.
    var groupInfoElement = "<ul>" +
        "<li>Group ID: " + group.group_id + "</li>" +
        "<li>Name: " + group.group_name + "</li>" +
        "<li>Muted: " + group.muted + "</li>" +
        "<li>Owner: " + group.owners[0].full_user_id + "</li>" +
        "<li>Members: <ul>";

    if (group.members) {
        group.members.forEach(function (member) {
            groupInfoElement += "<li>" + member.full_user_id + "</li>";
        });
    }
    groupInfoElement += "</ul></ul>";

    // Output the group information to the group element.
    groupElement.innerHTML += groupInfoElement;
}

// What to do on a get info failure.
function onGetInfoFailure() {
    log("Failed to get group.")
}

// Called when a message is sent to the group.
function onChatGroupMessage(message) {
    // Handle the message.
    var id = message.group_id;
    var messageText = message.message.text;
    var sender = message.sender.user_id;
    // Create the message element. Use Lodash to escape the message to prevent security issues.
    var element = "<div>" + sender + " (" + id + "): " + _.escape(messageText) + "</div>";

    // Add the message to the chat messages div.
    document.getElementById("g-chat-messages").innerHTML += element;
}


// Called when a user is added to a group.
function onChatGroupInvite(message) {
    var id = message.group_id;
    var inviter = message.inviter;
    var invitees = message.invitees.join(", ");

    var element = "<div>" + invitees + " was added to group " + id + " by " + inviter + ".</div>";

    document.getElementById("g-chat-messages").innerHTML += element;
}

// Called when a user is removed from a group.
function onChatGroupBoot(message) {
    var id = message.group_id;
    var booter = message.booter;
    var booted = message.booted.join(", ");

    var element = "<div>" + booted + " was removed from group " + id + " by " + booter + ".</div>";

    document.getElementById("g-chat-messages").innerHTML += element;
}

// Called when a group is updated.
function onChatGroupUpdate(message) {
    var id = message.group_id;
    var updater = message.updater;
    var name = message.group_name;

    var element = "<div>Group " + id + " was updated by " + updater + " to " + name + ".</div>";

    document.getElementById("g-chat-messages").innerHTML += element;
}


// Called when a group is deleted.
function onChatGroupDelete(message) {
    var id = message.group_id;
    var eraser = message.eraser;

    var element = "<div>Group " + id + " was deleted by " + eraser + ".</div>";

    document.getElementById("g-chat-messages").innerHTML += element;
}


// begin json message code
// Gathers the user's input and sends a JSON message to the recipient.
function sendJSONMessage() {
    // Get user input.
    // The URL format we're expecting is https://www.youtube.com/watch?v=Ely5wLcNw0Q
    var jsonRecipient = document.getElementById('json-recipient').value;
    var url = document.getElementById('json-youtube-video').value;

    // Create the JSON object.
    var data = {
        "type": "youtubeVideo",
        "url": url
    };

    // Send the JSON message.
    kandy.messaging.sendJSON(jsonRecipient, data, onSendSuccess, onSendFailure);
}

// What to do on a send JSON success.
function onSendSuccess() {
    log("JSON message sent successfully.");
}

// What to do on a send JSON failure.
function onSendFailure() {
    log("Failed to send JSON message.");
}

/**
 * Called when the `message` event is triggered.
 * Receives the message object as a parameter.
 */
function onMessageReceived(message) {
    var sender = message.sender.user_id;
    var content = message.message;

    // Determine if the message JSON message.
    if (content.mimeType == "application/json") {

        // Parse the JSON object to ensure it's format.
        var data = JSON.parse(content.json);

        // Determine the type of message that was sent.
        if (data.type == "youtubeVideo") {
            // Get the video's ID.
            // Here we're expecting a url like https://www.youtube.com/watch?v=Ely5wLcNw0Q
            var url = data.url;
            var embedID = url.substring(url.indexOf('?v=') + 3);

            // Create the element that will display the video.
            // Use Lodash to escape the embedID for security purposes.
            var element = "<iframe id='ytplater' type='text/html' " +
                "width='100%' height='480' src='https://www.youtube.com/embed/" +
                _.escape(embedID) + "?autoplay=0'> Your browser does not support iframe </iframe>";

            // Display the video with a message.
            log(sender + " sent you a video to watch!");
            // $(".messagesFailed").load(location.href + " .messagesFailed");
            $('#json-messages').html(element);
            console.log("json");
        } else {
            // Handle other JSON message types.
        }

    }

    // Check the type of message received.
    if (message.contentType === "image") {
        // Build the image Url.
        var imageUrl = kandy.messaging.buildFileUrl(message.message.content_uuid);

        // Create img and download link elements.
        var imageElement = '<img src="' + imageUrl + '">';
        var imageDownload = '<a href="' + imageUrl + '" download>Download</a>';

        // Display a message and download link to the user.
        log(message.sender.user_id + ' has sent you an image! ');
        // Display the image.
        // log(imageElement);
        $('#received-image-download').html(imageDownload);
        $('#recieved-image').html(imageElement);

    }
}

// code for send file is here

// Gather the user input then send the image.
function sendImage() {
    // Gather user input.
    var recipient = document.getElementById("file-recipient").value;
    var image = document.getElementById("file-image-input").files[0];

    // Send the image to the recipient.
    kandy.messaging.sendImWithImage(recipient, image, onFileSendSuccess, onFileSendFailure);
}

// What to do on a file send success.
function onFileSendSuccess(message) {
    log(message.message.content_name + " sent successfully.");
}

// What to do on a file send failure.
function onFileSendFailure() {
    log("File send failure.");
}

// // Called when a message is received.
// function onMessageReceived(message) {
//     // Check the type of message received.
//     if(message.contentType === "image") {
//         // Build the image Url.
//         var imageUrl = kandy.messaging.buildFileUrl(message.message.content_uuid);

//         // Create img and download link elements.
//         var imageElement = '<img src="' + imageUrl + '">';
//         var imageDownload = '<a href="' + imageUrl + '" download>Download</a>';

//         // Display a message and download link to the user.
//         log(message.sender.user_id + ' has sent you an image! ');
//         // Display the image.
//         // log(imageElement);
//         $('#received-image-download').html(imageDownload);
//         $('#recieved-image').html(imageElement);

//     }
// }

// end of the fileTransfer

// begin the address book

/**
 * Adds a contact to the user's address book.
 * Requires the username field to not be blank.
 */
function addContact() {
    // Create a new contact object with the user's input.
    var contact = {
        "username": document.getElementById('address-username').value,
        "firstName": document.getElementById('address-firstName').value,
        "lastName": document.getElementById('address-lastName').value,
        "favoriteColor": document.getElementById('favoriteColor').value
    };

    // Extra check to make sure username isn't empty.
    if (typeof contact.username == "") {
        // Consider it a failed add contact if it was blank.
        onAddFailure("Please enter a username.");
        return;
    }

    // Call Kandy's function to add the contact.
    kandy.addressbook.addToPersonalAddressBook(contact, onAddSuccess, onAddFailure);
}

// What to do on a successful add.
function onAddSuccess() {
    log("Add Contact success.");
}

// What to do on a failed add.
function onAddFailure(message) {
    log("Add Contact failure. " + message);
}

// Call Kandy's function to get the address book.
function getAddressBook() {
    kandy.addressbook.retrievePersonalAddressBook(onGetSuccess, onGetFailure);
}
// What to do on a failed get address book.
function onGetFailure() {
    log("Get Address Book failure.");
}
// What to do on a successful get address book.
function onGetSuccess(contacts) {
    log("Get Address Book success.");
    // Clear the contact list of any existing contacts.
    document.getElementById("contact-list").innerHTML = "Contacts:";

    // Iterate over the array to handle the contacts as we wish.
    for (var index in contacts) {
        displayContact(contacts[index]);
    }
}
// Displays the contact information by appending it to our contact list.
function displayContact(contact) {
    var element = "<ul>" +
        "<li>Username: " + contact.username + "</li>" +
        "<li>First name: " + contact.firstName + "</li>" +
        "<li>Last name: " + contact.lastName + "</li>" +
        "<li>Favourite Colour: " + contact.favoriteColor + "</li>" +
        "<li>Contact Id: " + contact.contact_id + "</li>" +
        "</ul>";

    document.getElementById("contact-list").innerHTML += element;
}
// Removes a contact from the user's address book.
function removeContact() {
    var contactId = document.getElementById("contact_id").value;

    // Ensure the contactId field had a value.
    if (contactId === "") {
        log("Please enter a contact id to remove a contact.");
        return;
    }

    kandy.addressbook.removeFromPersonalAddressBook(contactId, onRemoveSuccess, onRemoveFailure);
}
// What to do on a successful remove.
function onRemoveSuccess() {
    log("Remove Contact success.");
}

// What to do on a failed remove.
function onRemoveFailure() {
    log("Remove Contact failure.");
}

/** begin domain  directory code
 * Gets the user's input and calls the appropriate Kandy function for the chosen search type.
 * Takes the search type as a string parameter.
 */
function search(searchType) {
    // Get user input for the search string.
    var searchString = document.getElementById("search-string").value;
    // Clear the user list of any existing users.
    document.getElementById("user-list").innerHTML = "Results:";

    switch (searchType) {
        case "fullDirectory":
            kandy.addressbook.retrieveDirectory(onRetrieveSuccess, onRetrieveFailure);
            break;
        case "byFullText":
            kandy.addressbook.searchDirectory(searchString, onSearchSuccess, onSearchFailure);
            break;
        case "byUsername":
            kandy.addressbook.searchDirectoryByUsername(searchString, onSearchSuccess, onSearchFailure);
            break;
        case "byName":
            kandy.addressbook.searchDirectoryByName(searchString, onSearchSuccess, onSearchFailure);
            break;
        case "byPhoneNumber":
            kandy.addressbook.searchDirectoryByPhoneNumber(searchString, onSearchSuccess, onSearchFailure);
            break;
    }
}
// Utility function for appending messages to the message div.
// function log(message) {
//     document.getElementById("messages").innerHTML += "<div>" + message + "</div>";
// }

// Displays the user information by appending it to our user list.
function displayUser(user) {
    var element = "<ul>";
    for (var key in user) {
        element += "<li>" + key + ": " + user[key] + "</li>";
    }
    element += "</ul>";

    document.getElementById("user-list").innerHTML += element;
}
// What to do on a successful retrieve directory.
function onRetrieveSuccess(users) {
    log("Retrieve directory success.");
    // Iterate over the user list and display each user.
    users.contacts.forEach(function (user) {
        displayUser(user);
    });
}

// What to do on a failed retrieve directory.
function onRetrieveFailure() {
    log("Retrieve directory failure.");
}
// What to do on a successful search.
function onSearchSuccess(users) {
    log("Search success.");

    // Make sure users were found before continuing.
    if (users.length === 0) {
        document.getElementById("user-list").innerHTML += "<div>No users found.</div>";
        return;
    }
    // Iterate over the user array and display each user.
    users.forEach(function (user) {
        displayUser(user);
    });
}

// What to do on a failed search.
function onSearchFailure() {
    log("Search failure.")
}

// begin session code
// Creates a session.
function createSession() {
    // Give our session a type and a unique name.
    var randomId = Date.now();
    var sessionConfig = {
        session_type: 'whiteboard-demo',
        session_name: randomId
    };

    // Create the session.
    kandy.session.create(sessionConfig, onSessionCreateSuccess, onSessionFailure);
}
// Keep track of the session Id.
var sessionId;

// What to do on a create session success.
function onSessionCreateSuccess(session) {
    sessionId = session.session_id;

    // Let the user know what happened.
    log('Created session: ' + sessionId);
    // Display the session Id for the user.
    document.getElementById('current-session-id').value = sessionId;

    // Activate the session.
    kandy.session.activate(sessionId);

    // Declare our listeners.
    var listeners = {
        'onData': onData,
        'onUserJoin': onUserJoin,
        // Include the admin-only event listener.
        'onUserJoinRequest': onUserJoinRequest
    };

    // Register event listeners.
    kandy.session.setListeners(sessionId, listeners);
}
// What to do on a session error.
function onSessionFailure() {
    log('Error creating/joining session.');
}
// Joins a session.
function joinSession() {
    // Gather the user's input.
    sessionId = document.getElementById('join-session-id').value;

    // Join the session.
    kandy.session.join(sessionId, {}, onSessionJoinSuccess, onSessionFailure);
}
// What to do on join session success.
function onSessionJoinSuccess() {
    // Let the user know what happened.
    log('Joined session: ' + sessionId);
    // Display the session Id for the user.
    document.getElementById('current-session-id').value = sessionId;

    // Declare our listeners.
    var listeners = {
        'onData': onData,
        'onUserJoin': onUserJoin
    };

    // Register listeners.
    kandy.session.setListeners(sessionId, listeners);
}
// Automatically accept join requests.
function onUserJoinRequest(data) {
    kandy.session.acceptJoinRequest(data.session_id, data.full_user_id);
}
// Let the user know another user has joined.
function onUserJoin(data) {
    log(data.full_user_id + ' has joined the session.');
}
// Get the canvas element.
var canvas = document.getElementById('canvas');
// Get the actual CanvasRenderingContext2D object.
var ctx = canvas.getContext('2d');

// Set some configurations for drawing lines.
ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = 'blue';

// Flag for whether we're currently drawing.
var isDrawing = false;

// Position objects to keep track of line X and Y coordinates.
var startPos = {};
var endPos = {};
// Listen for the user holding the mouse button down.
canvas.addEventListener('mousedown', mouseDown);
// Listen for the user releasing the mouse button.
canvas.addEventListener('mouseup', mouseUp);
// Listen for the user moving the mouse.
canvas.addEventListener('mousemove', mouseMove);
// Listen for the mouse moving outside the canvas area.
canvas.addEventListener('mouseout', mouseUp);
// What to do on a mousedown event.
function mouseDown(e) {
    // Set flag to currently drawing.
    isDrawing = true;
    // Set the position to where the mouse is now.
    pos = {
        x: e.pageX - this.offsetLeft,
        y: e.pageY - this.offsetTop
    };
    // There isn't a previous position, since this is a new line.
    prevPos = {};
}
// What to do on a mouseup or mouseout event.
function mouseUp(e) {
    isDrawing = false;
}
// What to do on a mousemove event.
function mouseMove(e) {
    // If we aren't drawing, do nothing.
    if (!isDrawing) {
        return;
    }

    // Update our line end-point coordinates.
    prevPos = {
        x: pos.x,
        y: pos.y
    };
    pos = {
        x: e.pageX - this.offsetLeft,
        y: e.pageY - this.offsetTop
    };

    // Create our data object to send.
    var data = {
        prevPos: 'prevPos',
        pos: 'pos'
    };

    // Draw the line on our own canvas.
    drawLine(data);
    // Send the data to the session for other canvases.
    kandy.session.sendData(sessionId, data, onSendSuccess, onSendFailure);
}
// Draw a line on the canvas using data coordinates.
function drawLine(coordinates) {
    var start = coordinates.prevPos;
    var end = coordinates.pos;

    // Begin a new path (what I've been calling a line).
    ctx.beginPath();
    // Set the start position of the path.
    ctx.moveTo(start.x, start.y);
    // Set the end position of the path.
    ctx.lineTo(end.x, end.y);
    // End the path.
    ctx.closePath();
    // Draw the path.
    ctx.stroke();
}
// What to do on send data success.
function onSendSuccess() {
    log('Data sent successfully.');
}

// What to do on send data failure.
function onSendFailure() {
    log('Failed to send data.');
}
// Handle received data from the session.
function onData(data) {
    // Draw the line on our canvas.
    drawLine(data.payload);
}

// edn fo session code


