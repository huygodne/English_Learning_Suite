import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import ScenicBackground from '../components/ScenicBackground';
import { useAuth } from '../contexts/AuthContext';
import { useQuickPanel } from '../contexts/QuickPanelContext';
import { lessonService, testService, userProgressService } from '../services/api';
import { LessonSummary, TestSummary, UserLessonProgress, UserTestProgress, UserProgressSummary } from '../types';
import HomeHeader from './home/components/HomeHeader';
import DashboardSection from './home/components/DashboardSection';
import GuestExperience from './home/components/GuestExperience';
import SiteFooter from './home/components/SiteFooter';

const HomePage: React.FC = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const { toggle: toggleQuickPanel } = useQuickPanel();

  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const howItWorksRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  const [lastScrollY, setLastScrollY] = useState(0);

  const [lessons, setLessons] = useState<LessonSummary[]>([]);
  const [tests, setTests] = useState<TestSummary[]>([]);
  const [lessonsLoading, setLessonsLoading] = useState(false);
  const [testsLoading, setTestsLoading] = useState(false);
  const [summary, setSummary] = useState<UserProgressSummary | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [lessonProgress, setLessonProgress] = useState<UserLessonProgress[]>([]);
  const [testProgress, setTestProgress] = useState<UserTestProgress[]>([]);

  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-slide-in-up');
        }
      });
    }, observerOptions);

    const elementsToObserve = [
      heroRef.current,
      featuresRef.current,
      statsRef.current,
      howItWorksRef.current,
      testimonialsRef.current,
      ctaRef.current
    ].filter(Boolean) as Element[];

    elementsToObserve.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setScrollDirection('down');
      } else if (currentScrollY < lastScrollY) {
        setScrollDirection('up');
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    const fetchDashboardData = async () => {
      setLessonsLoading(true);
      setTestsLoading(true);
      setSummaryLoading(true);

      try {
        const [lessonsData, testsData, summaryData, lessonProgressData, testProgressData] = await Promise.all([
          lessonService.getAllLessons().catch(() => []),
          testService.getAllTests().catch(() => []),
          userProgressService.getSummary(user.id).catch(() => null),
          userProgressService.getLessonProgress(user.id).catch(() => []),
          userProgressService.getTestProgress(user.id).catch(() => [])
        ]);

        setLessons([...lessonsData].sort((a, b) => a.level - b.level));
        setTests([...testsData].sort((a, b) => a.level - b.level));
        if (summaryData) {
          setSummary(summaryData);
        } else {
          setSummary(null);
        }
        setLessonProgress(lessonProgressData ?? []);
        setTestProgress(testProgressData ?? []);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setLessons([]);
        setTests([]);
        setSummary(null);
        setLessonProgress([]);
        setTestProgress([]);
      } finally {
        setLessonsLoading(false);
        setTestsLoading(false);
        setSummaryLoading(false);
      }
    };

    fetchDashboardData();
  }, [isAuthenticated, user?.id]);

  const sectionRefs = {
    heroRef,
    featuresRef,
    statsRef,
    howItWorksRef,
    testimonialsRef,
    ctaRef
  };

  return (
    <div className="relative min-h-screen">
      <ScenicBackground variant="mountain" />

      <HomeHeader
        isAuthenticated={isAuthenticated}
        userName={user?.fullName}
        onLogout={logout}
        mobileMenuOpen={mobileMenuOpen}
        onToggleMobileMenu={() => setMobileMenuOpen((prev) => !prev)}
        onToggleHamburgerMenu={toggleQuickPanel}
      />

      <AnimatePresence>
        {isAuthenticated && (
          <DashboardSection
            userName={user?.fullName}
            lessons={lessons}
            tests={tests}
            lessonsLoading={lessonsLoading}
            testsLoading={testsLoading}
            summary={summary ?? undefined}
            summaryLoading={summaryLoading}
            lessonProgress={lessonProgress}
            testProgress={testProgress}
            onNavigateToLessons={() => navigate('/lessons')}
          />
        )}
      </AnimatePresence>

      <GuestExperience
        isAuthenticated={isAuthenticated}
        userName={user?.fullName}
        sectionRefs={sectionRefs}
        scrollDirection={scrollDirection}
      />

      <SiteFooter />

      <div className="scroll-indicator">
        <div className="scroll-arrow" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </div>
        <div className={`scroll-dot ${scrollDirection === 'up' ? 'active' : ''}`}></div>
        <div className={`scroll-dot ${scrollDirection === 'down' ? 'active' : ''}`}></div>
        <div
          className="scroll-arrow"
          onClick={() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })}
        >
          <svg className="w-4 h-4 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

