import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import LanguageSelection from "./pages/LanguageSelection";
import AgeVerification from "./pages/AgeVerification";
import GenderSelection from "./pages/GenderSelection";
import CameraCapture from "./pages/CameraCapture";
import CNICCapture from "./pages/CNICCapture";
import PhoneNumberInput from "./pages/PhoneNumberInput";
import DiseaseSelection from "./pages/DiseaseSelection";
import DiseaseCapture from "./pages/DiseaseCapture";
import Questionnaire from "./pages/Questionnaire";
import Results from "./pages/Results";

function App() {
  return (
    <LanguageProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LanguageSelection />} />
          <Route path="/age-verification" element={<AgeVerification />} />
          <Route path="/gender-selection" element={<GenderSelection />} />
          <Route path="/camera-capture" element={<CameraCapture />} />
          <Route path="/cnic-capture" element={<CNICCapture />} />
          <Route path="/phone-number" element={<PhoneNumberInput />} />
          <Route path="/disease-selection" element={<DiseaseSelection />} />
          <Route path="/disease-capture/:diseaseId" element={<DiseaseCapture />} />
          <Route path="/questionnaire/:diseaseId" element={<Questionnaire />} />
          <Route path="/results" element={<Results />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </LanguageProvider>
  );
}

export default App;
