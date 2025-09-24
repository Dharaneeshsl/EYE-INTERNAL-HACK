// SurveyForm.jsx
import { Survey } from 'survey-react-ui';
import 'survey-core/defaultV2.min.css';

export default function SurveyForm({ json, onComplete }) {
  return (
    <Survey json={json} onComplete={onComplete} />
  );
}
