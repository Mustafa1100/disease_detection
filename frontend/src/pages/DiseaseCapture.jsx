import { useParams, Navigate } from "react-router-dom";
import BreathingCapture from "./BreathingCapture";
import EyesCapture from "./EyesCapture";
import DengueCapture from "./DengueCapture";
import SkinCapture from "./SkinCapture";

const DiseaseCapture = () => {
  const { diseaseId } = useParams();

  switch (diseaseId) {
    case "breathing":
      return <BreathingCapture />;
    case "eyes":
      return <EyesCapture />;
    case "dengue":
      return <DengueCapture />;
    case "skin":
      return <SkinCapture />;
    default:
      return <Navigate to="/disease-selection" replace />;
  }
};

export default DiseaseCapture;


