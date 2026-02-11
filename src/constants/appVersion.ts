export type AppVersionStatus = "active" | "disabled";

export const appVersionStatus: Record<
  AppVersionStatus,
  { name: AppVersionStatus; displayName: string }
> = {
  active: { name: "active", displayName: "Active" },
  disabled: { name: "disabled", displayName: "Disabled" },
};
