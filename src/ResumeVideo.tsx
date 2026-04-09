import React from "react";
import { AbsoluteFill, Series, interpolate, useCurrentFrame, staticFile } from "remotion";
import { Audio } from "@remotion/media";
import { HeroScene } from "./scenes/HeroScene";
import { ExperienceScene } from "./scenes/ExperienceScene";
import { SkillsScene } from "./scenes/SkillsScene";
import { EducationScene } from "./scenes/EducationScene";
import { OutroScene } from "./scenes/OutroScene";
import { theme } from "./theme";

// Scene durations at 30fps
const HERO = 150;        // 5s
const EXP_MAIN = 180;    // 6s — NextGen (most important)
const EXP_SHORT = 120;   // 4s — UST + Satyam
const SKILLS = 150;      // 5s
const EDUCATION = 120;   // 4s
const OUTRO = 120;       // 4s
const TRANSITION = 15;   // 0.5s overlap for cross-fade

// Wraps a scene in a cross-fade transition envelope
const FadeScene: React.FC<{ children: React.ReactNode; durationInFrames: number }> = ({
  children,
  durationInFrames,
}) => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, TRANSITION], [0, 1], { extrapolateRight: "clamp" });
  const fadeOut = interpolate(
    frame,
    [durationInFrames - TRANSITION, durationInFrames],
    [1, 0],
    { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
  );
  const opacity = Math.min(fadeIn, fadeOut);

  return (
    <AbsoluteFill style={{ opacity }}>
      {children}
    </AbsoluteFill>
  );
};

export const ResumeVideo: React.FC = () => {
  const FADE_IN_FRAMES = 45;   // 1.5s fade in
  const FADE_OUT_FRAMES = 60;  // 2s fade out at the end

  return (
    <AbsoluteFill style={{ background: theme.bg }}>
      {/* Background music — fades in over 1.5s, fades out over last 2s, loops if needed */}
      <Audio
        src={staticFile("bgm.mp3")}
        loop
        volume={(f) =>
          interpolate(
            f,
            [0, FADE_IN_FRAMES, totalDurationInFrames - FADE_OUT_FRAMES, totalDurationInFrames],
            [0, 0.35, 0.35, 0],
            { extrapolateLeft: "clamp", extrapolateRight: "clamp" }
          )
        }
      />
      <Series>
        <Series.Sequence durationInFrames={HERO}>
          <FadeScene durationInFrames={HERO}>
            <HeroScene />
          </FadeScene>
        </Series.Sequence>

        <Series.Sequence durationInFrames={EXP_MAIN}>
          <FadeScene durationInFrames={EXP_MAIN}>
            <ExperienceScene index={0} />
          </FadeScene>
        </Series.Sequence>

        <Series.Sequence durationInFrames={EXP_SHORT}>
          <FadeScene durationInFrames={EXP_SHORT}>
            <ExperienceScene index={1} />
          </FadeScene>
        </Series.Sequence>

        <Series.Sequence durationInFrames={EXP_SHORT}>
          <FadeScene durationInFrames={EXP_SHORT}>
            <ExperienceScene index={2} />
          </FadeScene>
        </Series.Sequence>

        <Series.Sequence durationInFrames={SKILLS}>
          <FadeScene durationInFrames={SKILLS}>
            <SkillsScene />
          </FadeScene>
        </Series.Sequence>

        <Series.Sequence durationInFrames={EDUCATION}>
          <FadeScene durationInFrames={EDUCATION}>
            <EducationScene />
          </FadeScene>
        </Series.Sequence>

        <Series.Sequence durationInFrames={OUTRO}>
          <FadeScene durationInFrames={OUTRO}>
            <OutroScene />
          </FadeScene>
        </Series.Sequence>
      </Series>
    </AbsoluteFill>
  );
};

export const totalDurationInFrames =
  HERO + EXP_MAIN + EXP_SHORT + EXP_SHORT + SKILLS + EDUCATION + OUTRO;
