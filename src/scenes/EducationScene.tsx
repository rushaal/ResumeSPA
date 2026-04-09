import React from "react";
import { useCurrentFrame, interpolate } from "remotion";
import { theme } from "../theme";
import { resume } from "../data";

export const EducationScene: React.FC = () => {
  const frame = useCurrentFrame();

  const headerOpacity = interpolate(frame, [0, 25], [0, 1], { extrapolateRight: "clamp" });
  const headerY = interpolate(frame, [0, 25], [20, 0], { extrapolateRight: "clamp" });
  const eduOpacity = interpolate(frame, [20, 45], [0, 1], { extrapolateRight: "clamp" });
  const eduY = interpolate(frame, [20, 45], [25, 0], { extrapolateRight: "clamp" });
  const certOpacity1 = interpolate(frame, [40, 65], [0, 1], { extrapolateRight: "clamp" });
  const certOpacity2 = interpolate(frame, [55, 80], [0, 1], { extrapolateRight: "clamp" });

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
      <div
        style={{
          position: "absolute",
          top: "-20%",
          right: "-10%",
          width: "50%",
          height: "70%",
          background: `radial-gradient(ellipse, rgba(255,159,10,0.07) 0%, transparent 70%)`,
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
          Education & Certifications
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
          Academic &{" "}
          <span style={{ color: theme.amber, fontStyle: "italic" }}>Credentials</span>
        </div>
      </div>

      {/* Education card */}
      <div
        style={{
          opacity: eduOpacity,
          transform: `translateY(${eduY}px)`,
          background: theme.surface,
          border: `1px solid ${theme.border}`,
          borderRadius: 16,
          padding: "28px 32px",
          marginBottom: 24,
          maxWidth: 760,
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0, height: 3,
            background: theme.amber,
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
            color: theme.amber,
            marginBottom: 10,
          }}
        >
          Education
        </div>
        <div
          style={{
            fontFamily: theme.fontDisplay,
            fontSize: 24,
            fontWeight: 400,
            color: theme.ink,
            marginBottom: 6,
          }}
        >
          {resume.education.degree}
        </div>
        <div
          style={{
            fontSize: 15,
            fontFamily: theme.fontBody,
            color: theme.ink2,
            marginBottom: 4,
          }}
        >
          {resume.education.institution}
        </div>
        <div
          style={{
            fontSize: 13,
            fontFamily: theme.fontBody,
            color: theme.ink3,
          }}
        >
          {resume.education.year}
        </div>
      </div>

      {/* Certs */}
      <div style={{ display: "flex", gap: 20, maxWidth: 760 }}>
        {resume.certifications.map((cert, i) => {
          const op = i === 0 ? certOpacity1 : certOpacity2;
          return (
            <div
              key={cert.name}
              style={{
                opacity: op,
                flex: 1,
                background: theme.surface,
                border: `1px solid ${theme.border}`,
                borderRadius: 16,
                padding: "24px 28px",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0, height: 3,
                  background: theme.accent,
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
                  color: theme.accent,
                  marginBottom: 10,
                }}
              >
                Certification
              </div>
              <div
                style={{
                  fontFamily: theme.fontBody,
                  fontSize: 16,
                  fontWeight: 500,
                  color: theme.ink,
                  marginBottom: 6,
                  lineHeight: 1.3,
                }}
              >
                {cert.name}
              </div>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: theme.fontBody,
                  color: theme.ink3,
                }}
              >
                {cert.body}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
