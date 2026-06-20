import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Home from "@/pages/Home";
import SwordList from "@/pages/SwordList";
import SwordDetail from "@/pages/SwordDetail";
import SwordsmanList from "@/pages/SwordsmanList";
import SwordsmanDetail from "@/pages/SwordsmanDetail";
import SectList from "@/pages/SectList";
import JianghuMap from "@/pages/JianghuMap";
import GeographyStats from "@/pages/GeographyStats";
import ComparisonDetail from "@/pages/ComparisonDetail";
import KnowledgeList from "@/pages/KnowledgeList";
import KnowledgeDetail from "@/pages/KnowledgeDetail";
import LegendarySwordList from "@/pages/LegendarySwordList";
import LegendarySwordDetail from "@/pages/LegendarySwordDetail";
import MuseumList from "@/pages/MuseumList";
import MuseumDetail from "@/pages/MuseumDetail";

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col bg-ink-100">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/swords" element={<SwordList />} />
            <Route path="/swords/:id" element={<SwordDetail />} />
            <Route path="/swordsmen" element={<SwordsmanList />} />
            <Route path="/swordsmen/:id" element={<SwordsmanDetail />} />
            <Route path="/sects" element={<SectList />} />
            <Route path="/map" element={<JianghuMap />} />
            <Route path="/map/stats" element={<GeographyStats />} />
            <Route path="/comparison/:targetType/:id" element={<ComparisonDetail />} />
            <Route path="/knowledge" element={<KnowledgeList />} />
            <Route path="/knowledge/:id" element={<KnowledgeDetail />} />
            <Route path="/legendary-swords" element={<LegendarySwordList />} />
            <Route path="/legendary-swords/:id" element={<LegendarySwordDetail />} />
            <Route path="/museum" element={<MuseumList />} />
            <Route path="/museum/:id" element={<MuseumDetail />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
