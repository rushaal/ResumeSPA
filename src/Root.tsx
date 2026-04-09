import React from "react";
import { Composition } from "remotion";
import { ResumeVideo, totalDurationInFrames } from "./ResumeVideo";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="ResumeVideo"
        component={ResumeVideo}
        durationInFrames={totalDurationInFrames}
        fps={30}
        width={1920}
        height={1080}
      />
    </>
  );
};
