import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { resume } from "../data";

interface Props {
  index: number; // which experience entry to show (0, 1, 2)
}

export const ExperienceScene: React.FC<Props> = ({ index }) => {
  const frame = useCurrentFrame();
  const exp = resume.experience[index];

  const headerOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 25], [30, 0], { extrapolateRight: "clamp" });

  const metaOpacity = interpolate(frame, [20, 40], [0, 1], { extrapolateRight: "clamp" });

  const isMainRole = index === 0;

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: theme.bg,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "0 120px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Accent line */}
      <div
        style={{
          position: "absolute",
          left: 60,
          top: "15%",
          bottom: "15%",
          width: 3,
          background: `linear-gradient(to bottom, transparent, ${theme.accent}, transparent)`,
          borderRadius: 2,
          opacity: interpolate(frame, [0, 30], [0, 0.6], { extrapolateRight: "clamp" }),
        }}
      />

      {/* Section label */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          fontSize: 11,
          fontFamily: theme.fontBody,
          fontWeight: 600,
          letterSpacing: "0.14em",
          textTransform: "uppercase" as const,
          color: theme.ink3,
          marginBottom: 20,
        }}
      >
        Work Experience {index + 1} of {resume.experience.length}
      </div>

      {/* Company & Role */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: 8,
        }}
      >
        <div
          style={{
            fontFamily: theme.fontDisplay,
            fontSize: isMainRole ? 52 : 40,
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
            color: theme.ink,
            marginBottom: 6,
          }}
        >
          {exp.company}
        </div>
        <div
          style={{
            fontSize: isMainRole ? 22 : 18,
            fontFamily: theme.fontBody,
            fontWeight: 400,
            color: theme.accent,
            letterSpacing: "-0.01em",
          }}
        >
          {exp.role}
        </div>
      </div>

      {/* Period & Duration */}
      <div
        style={{
          opacity: metaOpacity,
          display: "flex",
          alignItems: "center",
          gap: 16,
          marginTop: 16,
          marginBottom: 36,
        }}
      >
        <span
          style={{
            fontSize: 14,
            fontFamily: theme.fontBody,
            color: theme.ink3,
          }}
        >
          {exp.period}
        </span>
        <span style={{ color: theme.border, fontSize: 14 }}>·</span>
        <span
          style={{
            fontSize: 13,
            fontFamily: theme.fontBody,
            fontWeight: 600,
            color: theme.amber,
            padding: "3px 10px",
            borderRadius: 980,
            background: "rgba(255,159,10,0.1)",
            border: "1px solid rgba(255,159,10,0.2)",
          }}
        >
          {exp.duration}
        </span>
      </div>

      {/* Divider */}
      <div
        style={{
          height: 1,
          background: theme.border,
          marginBottom: 32,
          opacity: metaOpacity,
          width: "100%",
          maxWidth: 800,
        }}
      />

      {/* Highlights */}
      <div style={{ maxWidth: 800 }}>
        {exp.highlights.map((h, i) => {
          const bulletOpacity = interpolate(
            frame,
            [35 + i * 12, 55 + i * 12],
            [0, 1],
            { extrapolateRight: "clamp" }
          );
          const bulletX = interpolate(
            frame,
            [35 + i * 12, 55 + i * 12],
            [-20, 0],
            { extrapolateRight: "clamp" }
          );
          return (
            <div
              key={i}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 14,
                marginBottom: 18,
                opacity: bulletOpacity,
                transform: `translateX(${bulletX}px)`,
              }}
            >
              <div
                style={{
                  width: 5,
                  height: 5,
                  borderRadius: "50%",
                  background: theme.accent,
                  marginTop: 8,
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  fontSize: 15,
                  fontFamily: theme.fontBody,
                  fontWeight: 300,
                  color: theme.ink2,
                  lineHeight: 1.6,
                }}
              >
                {h}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
