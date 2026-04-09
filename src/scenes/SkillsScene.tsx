import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { resume } from "../data";

const groupColors = [theme.accent, theme.amber, theme.green];

export const SkillsScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 25], [20, 0], { extrapolateRight: "clamp" });

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
      {/* BG glow bottom right */}
      <div
        style={{
          position: "absolute",
          bottom: "-30%",
          right: "-10%",
          width: "60%",
          height: "80%",
          background: `radial-gradient(ellipse, rgba(48,209,88,0.06) 0%, transparent 70%)`,
          pointerEvents: "none",
        }}
      />

      {/* Header */}
      <div
        style={{
          opacity: headerOpacity,
          transform: `translateY(${headerY}px)`,
          marginBottom: 56,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontFamily: theme.fontBody,
            fontWeight: 600,
            letterSpacing: "0.14em",
            textTransform: "uppercase" as const,
            color: theme.ink3,
            marginBottom: 12,
          }}
        >
          Core Competencies
        </div>
        <div
          style={{
            fontFamily: theme.fontDisplay,
            fontSize: 56,
            fontWeight: 400,
            letterSpacing: "-0.03em",
            lineHeight: 1.0,
            color: theme.ink,
          }}
        >
          Skills &{" "}
          <span style={{ color: theme.accent, fontStyle: "italic" }}>Expertise</span>
        </div>
      </div>

      {/* Skill Groups */}
      <div style={{ display: "flex", gap: 48, alignItems: "flex-start" }}>
        {resume.skillGroups.map((group, gi) => {
          const groupOpacity = interpolate(
            frame,
            [20 + gi * 15, 45 + gi * 15],
            [0, 1],
            { extrapolateRight: "clamp" }
          );
          const groupY = interpolate(
            frame,
            [20 + gi * 15, 45 + gi * 15],
            [30, 0],
            { extrapolateRight: "clamp" }
          );
          const color = groupColors[gi];

          return (
            <div
              key={group.label}
              style={{
                opacity: groupOpacity,
                transform: `translateY(${groupY}px)`,
                flex: 1,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                padding: "28px 28px 24px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  height: 3,
                  background: color,
                  borderRadius: "16px 16px 0 0",
                }}
              />

              <div
                style={{
                  fontSize: 11,
                  fontFamily: theme.fontBody,
                  fontWeight: 700,
                  letterSpacing: "0.1em",
                  textTransform: "uppercase" as const,
                  color,
                  marginBottom: 20,
                }}
              >
                {group.label}
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {group.skills.map((skill, si) => {
                  const pillOpacity = interpolate(
                    frame,
                    [35 + gi * 15 + si * 5, 55 + gi * 15 + si * 5],
                    [0, 1],
                    { extrapolateRight: "clamp" }
                  );
                  return (
                    <div
                      key={skill}
                      style={{
                        opacity: pillOpacity,
                        padding: "7px 14px",
                        borderRadius: 8,
                        background: theme.surface2,
                        border: `1px solid ${theme.border}`,
                        fontSize: 13,
                        fontFamily: theme.fontBody,
                        fontWeight: 400,
                        color: theme.ink2,
                      }}
                    >
                      {skill}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
