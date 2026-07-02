import { Routes, Route, Navigate } from 'react-router-dom';
import RecipeLibrary from '@/pages/RecipeLibrary';
import DietConfig from '@/pages/DietConfig';
import AIPlan from '@/pages/AIPlan';
import MealHistory from '@/pages/MealHistory';
import Login from '@/pages/Login';
import Mine from '@/pages/Mine';
import ChangePwd from '@/pages/ChangePwd';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<Navigate to="/recipe-library" replace />} />
      <Route path="/recipe-library" element={<RecipeLibrary />} />
      <Route path="/diet-config" element={<DietConfig />} />
      <Route path="/ai-plan" element={<AIPlan />} />
      <Route path="/meal-history" element={<MealHistory />} />
      <Route path="/mine" element={<Mine />} />
      <Route path="/change-pwd" element={<ChangePwd />} />
      <Route path="*" element={<Navigate to="/recipe-library" replace />} />
    </Routes>
  );
}
