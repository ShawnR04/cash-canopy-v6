export interface DeviceAccount {
  id: string;
  name?: string;
  username?: string;
  email: string;
  image?: string | null;
}

const STORAGE_KEY = "device_logged_accounts";

export function getDeviceAccounts(): DeviceAccount[] {
  if (typeof window === "undefined") return [];
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to parse device accounts", error);
    return [];
  }
}

export function saveDeviceAccount(account: DeviceAccount) {
  if (typeof window === "undefined") return;
  const accounts = getDeviceAccounts();
  // Prevent duplicate accounts
  const updated = accounts.filter((acc) => acc.id !== account.id);
  updated.push(account);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function removeDeviceAccount(accId: string) {
  if (typeof window === "undefined") return;
  const accounts = getDeviceAccounts();
  const updated = accounts.filter((acc) => acc.id !== accId);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}