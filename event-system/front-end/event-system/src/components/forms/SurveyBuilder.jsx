import React from "react";
import { Survey } from "survey-react-ui";

export default function SurveyBuilder({ json, onComplete }) {
  return (
    <div style={{ padding: "20px" }}>
      {/* Survey Form */}
      <Survey json={json} onComplete={onComplete} />
    </div>
  );
}
