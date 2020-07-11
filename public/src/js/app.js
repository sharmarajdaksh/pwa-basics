var deferredPrompt;
var enableNotificationButtons = document.querySelectorAll(
  ".enable-notifications"
);

if (!window.Promise) {
  window.Promise = Promise;
}

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then(function () {
      console.log("Service worker registered!");
    })
    .catch(function (err) {
      console.log(err);
    });
}

window.addEventListener("beforeinstallprompt", function (event) {
  console.log("beforeinstallprompt fired");
  event.preventDefault();
  deferredPrompt = event;
  return false;
});

function displayConfirmNotification() {
  if ("serviceWorker" in navigator) {
    var options = {
      body: "You have successfully subscribed to our Notification service!",
      icon: "/src/images/icons/app-icon-96x96.png",
      image: "/src/images/sf-boat.jpg",
      dir: "ltr",
      lang: "en-US",
      vibrate: [100, 50, 200],
      badge: "/src/images/icons/app-icon-96x96.png",
      tag: "confirm-notification",
      renotify: true,
      actions: [
        {
          action: "confirm",
          title: "Okay",
          icon: "/src/images/icons/app-icon-96x96.png",
        },
        {
          action: "cancel",
          title: "Cancel",
          icon: "/src/images/icons/app-icon-96x96.png",
        },
      ],
    };
    navigator.serviceWorker.ready.then(function (swreg) {
      swreg.showNotification("Successfully subscribed!", options);
    });
  }
}

function configurePushSub() {
  if (!("serviceWorker" in navigator)) return;

  var reg;
  navigator.serviceWorker.ready
    .then(function (swreg) {
      reg = swreg;
      return swreg.pushManager.getSubscription();
    })
    .then(function (sub) {
      if (sub == null) {
        // Create new subscription
        var vapidPublicKey =
          "BI34PVZrHinXjWlEJccrLDzMOB-gwrIse9ExkVuU0YJGqlvzzbzinCX9YaW1dOCh29dKuxCCtIKAFmTioYbuRo4";

        reg.pushManager.subscribe({
          userVisibleOnly: true,
        });
      } else {
        // We have a subscription
      }
    });
}

function askForNotificationsPermission(event) {
  Notification.requestPermission(function (result) {
    if (result !== "granted") {
      console.log("Permission not granted");
      return;
    }
    // displayConfirmNotification();
    configurePushSub();
  });
}

if ("Notification" in window) {
  for (var i = 0; i < enableNotificationButtons.length; i++) {
    enableNotificationButtons[i].style.display = "inline-block";
    enableNotificationButtons[i].addEventListener(
      "click",
      askForNotificationsPermission
    );
  }
}
