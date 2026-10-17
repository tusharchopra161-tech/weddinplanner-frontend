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

export async function enableAdminPushNotifications() {
  if (
    !("serviceWorker" in navigator) ||
    !("PushManager" in window) ||
    !("Notification" in window)
  ) {
    throw new Error(
      "Push notifications are not supported by this browser."
    );
  }

  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Please log in as an admin first.");
  }

  // Register the service worker.
  const registration = await navigator.serviceWorker.register(
    "/sw.js"
  );

  await navigator.serviceWorker.ready;

  // Permission must be requested following the admin's click.
  const permission = await Notification.requestPermission();

  if (permission !== "granted") {
    throw new Error(
      "Notification permission was not granted."
    );
  }

  // Retrieve the public VAPID key from the backend.
  const keyResponse = await fetch(
    `${API_URL}/push/public-key`
  );

  const keyData = await keyResponse.json();

  if (!keyResponse.ok || !keyData.publicKey) {
    throw new Error(
      keyData.message || "Could not retrieve push public key."
    );
  }

  // Reuse this browser's existing subscription if available.
  let subscription =
    await registration.pushManager.getSubscription();

  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        keyData.publicKey
      ),
    });
  }

  // Save this device's subscription in MongoDB.
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