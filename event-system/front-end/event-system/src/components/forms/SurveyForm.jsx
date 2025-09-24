// SurveyForm.jsx
import { Survey } from 'survey-react-ui';

export default function SurveyForm({ json, onComplete }) {
  return (
    <Survey json={json} onComplete={onComplete} />
  );
}
