export const accountabilityPermissions = ["streak", "checkins", "risk", "relapses", "support_requests", "weekly_progress", "goals", "journal"] as const;
export type AccountabilityPermission = typeof accountabilityPermissions[number];
export function canPartnerView(granted: readonly string[], permission: AccountabilityPermission) { return granted.includes(permission); }
export const defaultAccountabilityPermissions: AccountabilityPermission[] = ["streak", "weekly_progress", "support_requests"];
