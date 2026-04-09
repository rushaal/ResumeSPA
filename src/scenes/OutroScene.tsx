import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { resume } from "../data";

export const OutroScene: React.FC = () => {
  const frame = useCurrentFrame();

  const pulse = Math.sin((frame / 30) * Math.PI * 2) * 0.5 + 0.5;

  const nameOpacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const nameY = interpolate(frame, [0, 30], [30, 0], { extrapolateRight: "clamp" });
  const ctaOpacity = interpolate(frame, [25, 50], [0, 1], { extrapolateRight: "clamp" });
  const contactOpacity = interpolate(frame, [45, 70], [0, 1], { extrapolateRight: "clamp" });

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: theme.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center" as const,
        padding: "0 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Full radial glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `radial-gradient(ellipse 80% 60% at 50% 50%, ${theme.accentGlow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Live dot */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: theme.green,
          boxShadow: `0 0 ${10 + pulse * 8}px ${theme.green}`,
          marginBottom: 28,
          opacity: ctaOpacity,
        }}
      />

      {/* Name */}
      <div
        style={{
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
          fontFamily: theme.fontDisplay,
          fontSize: 80,
          fontWeight: 400,
          letterSpacing: "-0.03em",
          lineHeight: 1.0,
          color: theme.ink,
          marginBottom: 16,
        }}
      >
        Rushal{" "}
        <span style={{ color: theme.accent, fontStyle: "italic" }}>Maksane</span>
      </div>

      {/* CTA */}
      <div
        style={{
          opacity: ctaOpacity,
          fontSize: 20,
          fontFamily: theme.fontBody,
          fontWeight: 300,
          color: theme.ink2,
          marginBottom: 48,
          maxWidth: 560,
          lineHeight: 1.6,
        }}
      >
        {resume.status}
      </div>

      {/* Contact info */}
      <div
        style={{
          opacity: contactOpacity,
          display: "flex",
          gap: 32,
          alignItems: "center",
        }}
      >
        {[resume.contact.email, resume.contact.phone, resume.contact.location].map(
          (item) => (
            <div
              key={item}
              style={{
                padding: "10px 22px",
                borderRadius: 980,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                fontSize: 14,
                fontFamily: theme.fontBody,
                fontWeight: 400,
                color: theme.ink2,
              }}
            >
              {item}
            </div>
          )
        )}
      </div>
    </div>
  );
};
