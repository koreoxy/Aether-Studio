/**
 * SafeZone — reusable platform-UI protection system.
 *
 * `SafeZone` positions children inside the usable content area
 * (critical content never enters platform UI regions).
 * Full-bleed B-roll is allowed to overflow; only type/critical
 * elements live inside the zone.
 *
 * `SafeZoneGuides` is a preview-only overlay: dashed boundary + shaded
 * restricted bands + labels. It must NEVER be enabled for final render.
 */
import React from "react";
import type { Platform, SafeZoneConfig } from "../../projects/interstellar/safeZones";
import { safeRect, sharedSafeZones } from "../../projects/interstellar/safeZones";

export const SafeZone: React.FC<{
  platform: Platform;
  width: number;
  height: number;
  children: React.ReactNode;
  style?: React.CSSProperties;
}> = ({ platform, width, height, children, style }) => {
  const rect = safeRect(platform, width, height);
  return (
    <div
      style={{
        position: "absolute",
        left: rect.x,
        top: rect.y,
        width: rect.width,
        height: rect.height,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

export const SafeZoneGuides: React.FC<{
  platform: Platform;
  width: number;
  height: number;
}> = ({ platform, width, height }) => {
  const z: SafeZoneConfig = sharedSafeZones[platform];
  const rect = safeRect(platform, width, height);

  const band: React.CSSProperties = {
    position: "absolute",
    left: 0,
    right: 0,
    backgroundColor: "rgba(232, 67, 58, 0.14)",
  };
  const sideBand = (left: number): React.CSSProperties => ({
    position: "absolute",
    top: 0,
    bottom: 0,
    left,
    backgroundColor: "rgba(232, 67, 58, 0.14)",
  });

  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
        zIndex: 1000,
      }}
    >
      {/* restricted shading */}
      <div style={{ ...band, top: 0, height: z.top }} />
      <div style={{ ...band, bottom: 0, height: z.bottom }} />
      <div style={{ ...sideBand(0), width: z.left }} />
      <div style={{ ...sideBand(width - z.right), width: z.right }} />
      {/* safe boundary */}
      <div
        style={{
          position: "absolute",
          left: rect.x,
          top: rect.y,
          width: rect.width,
          height: rect.height,
          border: "3px solid rgba(88, 235, 160, 0.8)",
          borderRadius: 8,
        }}
      />
      {/* labels */}
      {(
        [
          [rect.x + 12, rect.y + 12, `SAFE ZONE ${platform.toUpperCase()} ${rect.width}x${rect.height}`],
          [60, z.top / 2 - 14, "PLATFORM UI — TOP RESTRICTED"],
          [60, height - z.bottom / 2 - 10, "PLATFORM UI — CAPTION/DESC RESTRICTED"],
          [40, 400, "UI"],
          [width - z.right / 2 - 30, 400, "UI"],
        ] as Array<[number, number, string]>
      ).map(([x, y, label], idx) => (
        <div
          key={idx}
          style={{
            position: "absolute",
            left: x,
            top: y,
            fontFamily: "Montserrat",
            fontWeight: 800,
            fontSize: 18,
            color: "rgba(232, 67, 58, 0.95)",
            backgroundColor: "rgba(255,255,255,0.85)",
            padding: "3px 8px",
            borderRadius: 4,
          }}
        >
          {label}
        </div>
      ))}
    </div>
  );
};
