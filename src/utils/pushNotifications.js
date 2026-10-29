
const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://weddingplanner-backend.onrender.com";

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);

  const base64 = (base64String + padding)
    .replace(/-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);

  return Uint8Array.from(rawData, (char) =>
    char.charCodeAt(0)
  );
}

async function getPublicKey() {
  const response = await fetch(`${API_URL}/push/public-key`);
  const result = await response.json();

  if (!response.ok || !result.publicKey) {
    throw new Error(
      result.message || "Could not retrieve push public key."
    );
  }

  return result.publicKey;
}

function getToken() {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in first.");
  }

  return token;
}

async function saveSubscription(subscription, token) {
  const response = await fetch(`${API_URL}/push/subscribe`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(subscription),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Could not save push subscription."
    );
  }

  return result;
}

export async function getPushNotificationStatus() {
  const supported =
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window;

  if (!supported) {
    return {
      supported: false,
      permission: "unsupported",
      enabled: false,
    };
  }

  const registration = await navigator.serviceWorker.getRegistration();

  const subscription = registration
    ? await registration.pushManager.getSubscription()
    : null;

  return {
    supported: true,
    permission: Notification.permission,
    enabled:
      Notification.permission === "granted" &&
      Boolean(subscription),
  };
}

export async function enablePushNotifications() {
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    throw new Error(
      "Push notifications are not supported by this browser."
    );
  }

  const token = getToken();

  const registration = await navigator.serviceWorker.register("/sw.js");
  await navigator.serviceWorker.ready;

  let permission = Notification.permission;

  if (permission === "default") {
    permission = await Notification.requestPermission();
  }

  if (permission !== "granted") {
    throw new Error(
      permission === "denied"
        ? "Notifications are blocked in browser settings."
        : "Notification permission was not granted."
    );
  }

  const publicKey = await getPublicKey();

  let subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(publicKey),
    });
  }

  // Save or associate this device with the currently logged-in account.
  return saveSubscription(subscription, token);
}

export async function disablePushNotifications() {
  const token = getToken();

  const registration = await navigator.serviceWorker.getRegistration();

  const subscription = registration
    ? await registration.pushManager.getSubscription()
    : null;

  if (!subscription) {
    return { success: true, message: "No active device subscription." };
  }

  // Remove the device subscription from the backend first.
  const response = await fetch(`${API_URL}/push/subscribe`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      endpoint: subscription.endpoint,
    }),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Could not remove push subscription."
    );
  }

  // Then disable push on this browser.
  const unsubscribed = await subscription.unsubscribe();

  if (!unsubscribed) {
    throw new Error(
      "The server subscription was removed, but the browser could not unsubscribe."
    );
  }

  return result;
}

// Backward compatibility with your existing admin component/import.
// export const enableAdminPushNotifications = enablePushNotifications;
