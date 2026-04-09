import React from "react";
import { useCurrentFrame, useVideoConfig, interpolate, spring } from "remotion";
import { theme } from "../theme";
import { resume } from "../data";

export const HeroScene: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });
  const eyebrowY = interpolate(frame, [0, 20], [20, 0], { extrapolateRight: "clamp" });

  const nameOpacity = interpolate(frame, [15, 40], [0, 1], { extrapolateRight: "clamp" });
  const nameY = interpolate(frame, [15, 40], [30, 0], { extrapolateRight: "clamp" });

  const titleOpacity = interpolate(frame, [35, 55], [0, 1], { extrapolateRight: "clamp" });
  const titleY = interpolate(frame, [35, 55], [20, 0], { extrapolateRight: "clamp" });

  const taglineOpacity = interpolate(frame, [50, 75], [0, 1], { extrapolateRight: "clamp" });
  const taglineY = interpolate(frame, [50, 75], [15, 0], { extrapolateRight: "clamp" });

  const statsOpacity = interpolate(frame, [70, 100], [0, 1], { extrapolateRight: "clamp" });
  const statsY = interpolate(frame, [70, 100], [20, 0], { extrapolateRight: "clamp" });

  const statusOpacity = interpolate(frame, [90, 110], [0, 1], { extrapolateRight: "clamp" });

  const pulse = Math.sin((frame / fps) * Math.PI * 2) * 0.5 + 0.5;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: theme.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "flex-start",
        padding: "0 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background glow */}
      <div
        style={{
          position: "absolute",
          top: "-20%",
          left: "-10%",
          width: "70%",
          height: "80%",
          background: `radial-gradient(ellipse, ${theme.accentGlow} 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Eyebrow */}
      <div
        style={{
          opacity: eyebrowOpacity,
          transform: `translateY(${eyebrowY}px)`,
          display: "flex",
          alignItems: "center",
          gap: 10,
          marginBottom: 28,
          fontSize: 13,
          fontFamily: theme.fontBody,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          color: theme.accent,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: theme.accent,
            opacity: 0.4 + pulse * 0.6,
            boxShadow: `0 0 ${8 + pulse * 6}px ${theme.accent}`,
          }}
        />
        Engineering Lead · Project Manager · Healthcare IT
      </div>

      {/* Name */}
      <div
        style={{
          opacity: nameOpacity,
          transform: `translateY(${nameY}px)`,
          fontFamily: theme.fontDisplay,
          fontSize: 96,
          fontWeight: 400,
          letterSpacing: "-0.03em",
          lineHeight: 1.0,
          color: theme.ink,
          marginBottom: 16,
        }}
      >
        <span style={{ display: "block" }}>Rushal</span>
        <span style={{ display: "block", color: theme.accent, fontStyle: "italic" }}>
          Maksane
        </span>
      </div>

      {/* Title */}
      <div
        style={{
          opacity: titleOpacity,
          transform: `translateY(${titleY}px)`,
          fontSize: 22,
          fontFamily: theme.fontBody,
          fontWeight: 300,
          color: theme.ink2,
          letterSpacing: "-0.01em",
          marginBottom: 32,
        }}
      >
        {resume.title}
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          fontSize: 16,
          fontFamily: theme.fontBody,
          fontWeight: 300,
          color: theme.ink3,
          lineHeight: 1.75,
          maxWidth: 620,
          marginBottom: 56,
        }}
      >
        {resume.tagline}
      </div>

      {/* Stats */}
      <div
        style={{
          opacity: statsOpacity,
          transform: `translateY(${statsY}px)`,
          display: "flex",
          gap: 56,
          paddingTop: 36,
          borderTop: `1px solid ${theme.border}`,
          width: "100%",
          maxWidth: 720,
        }}
      >
        {resume.stats.map((stat) => (
          <div key={stat.label}>
            <div
              style={{
                fontFamily: theme.fontDisplay,
                fontSize: 36,
                fontWeight: 400,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: theme.ink,
              }}
            >
              <span style={{ color: theme.accent, fontStyle: "italic" }}>{stat.number}</span>
            </div>
            <div
              style={{
                fontSize: 12,
                fontFamily: theme.fontBody,
                color: theme.ink3,
                marginTop: 6,
                letterSpacing: "0.02em",
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Status badge */}
      <div
        style={{
          opacity: statusOpacity,
          position: "absolute",
          bottom: 60,
          right: 120,
          padding: "10px 20px",
          borderRadius: 980,
          background: theme.surface2,
          border: `1px solid ${theme.border}`,
          fontSize: 13,
          fontFamily: theme.fontBody,
          fontWeight: 500,
          color: theme.green,
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div
          style={{
            width: 7,
            height: 7,
            borderRadius: "50%",
            background: theme.green,
            opacity: 0.4 + pulse * 0.6,
          }}
        />
        {resume.status}
      </div>
    </div>
  );
};
