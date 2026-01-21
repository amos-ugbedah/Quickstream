/**
 * Calculates the Unix timestamp for when the VIP pass should expire.
 */
export const calculateExpiry = (planType) => {
  const now = Date.now();
  const durations = {
    '24H': 24 * 60 * 60 * 1000,
    '6MONTHS': 180 * 24 * 60 * 60 * 1000,
  };
  return now + (durations[planType] || 0);
};

/**
 * Updates the User object. 
 * VIPs get the 'isVIP' flag which disables Ads and enables Notifications.
 */
export const saveVipPass = (expiryTimestamp, planName) => {
  const vipData = {
    active: true,
    expiry: expiryTimestamp,
    plan: planName,
    purchasedAt: Date.now()
  };
  localStorage.setItem('quickstream_vip', JSON.stringify(vipData));

  const localUser = JSON.parse(localStorage.getItem('user'));
  if (localUser) {
    const updatedUser = {
      ...localUser,
      isVIP: true,
      vipExpiresAt: expiryTimestamp,
      notificationsEnabled: true // VIPs automatically get "New Video" alerts
    };
    localStorage.setItem('user', JSON.stringify(updatedUser));
    return updatedUser;
  }
  return null;
};

/**
 * LOGIC CHECK: Should this user see ads?
 * Returns TRUE for free users or expired VIPs.
 * Returns FALSE for active VIPs.
 */
export const shouldShowAds = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user || !user.isVIP) return true; // Free user = Ads
  
  const isExpired = Date.now() > user.vipExpiresAt;
  return isExpired; // If expired = Ads
};