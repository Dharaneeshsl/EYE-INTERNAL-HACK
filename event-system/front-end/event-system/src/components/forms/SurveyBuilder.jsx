// SurveyBuilder.jsx
import { SurveyCreator, SurveyCreatorComponent } from 'survey-creator-react';
import 'survey-core/defaultV2.min.css';
import 'survey-creator-core/survey-creator-core.min.css';

export default function SurveyBuilder({ onSave, json }) {
  const creatorOptions = {
    showLogicTab: true,
    isAutoSave: false,
    showTranslationTab: false,
    showThemeTab: false,
    showTestSurveyTab: true,
    showJSONEditorTab: true,
    showEmbededSurveyTab: false,
    showPropertyGrid: true,
    showOptions: true,
    readOnly: false
  };

  return (
    <div className="w-full">
      <SurveyCreatorComponent
        creator={new SurveyCreator(creatorOptions)}
        json={json}
        onSaveSurvey={onSave}
      />
    </div>
  );
}
