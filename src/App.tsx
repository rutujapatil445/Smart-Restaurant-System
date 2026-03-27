import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Admin from './pages/Admin';
import AITools from './pages/AITools';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { AppProvider } from './context/AppContext';
import { NotificationProvider } from './context/NotificationContext';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMenu from './pages/admin/AdminMenu';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReservations from './pages/admin/AdminReservations';
import AdminStaff from './pages/admin/AdminStaff';
import AdminSettings from './pages/admin/AdminSettings';
import AdminAnalytics from './pages/admin/AdminAnalytics';
import AdminGallery from './pages/admin/AdminGallery';
import AdminReviews from './pages/admin/AdminReviews';
import AdminUsers from './pages/admin/AdminUsers';
import AdminNewsletter from './pages/admin/AdminNewsletter';
import AdminOffers from './pages/admin/AdminOffers';
import AdminContent from './pages/admin/AdminContent';
import AdminLayout from './pages/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AIChatbot from './components/AIChatbot';
import ErrorBoundary from './components/ErrorBoundary';
import NotFound from './components/NotFound';

const App: React.FC = () => {
  return (
    <AppProvider>
      <AuthProvider>
        <NotificationProvider>
          <CartProvider>
            <Router>
              <ErrorBoundary>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route 
                    path="/admin" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminDashboard />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/menu" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminMenu />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/orders" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminOrders />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/reservations" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminReservations />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/staff" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminStaff />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/settings" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminSettings />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/analytics" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminAnalytics />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/gallery" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminGallery />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/reviews" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminReviews />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/users" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminUsers />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/newsletter" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminNewsletter />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/offers" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminOffers />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/admin/content" 
                    element={
                      <ProtectedRoute adminOnly={true}>
                        <AdminLayout>
                          <AdminContent />
                        </AdminLayout>
                      </ProtectedRoute>
                    } 
                  />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/ai-tools" element={<AITools />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </ErrorBoundary>
              <AIChatbot />
            </Router>
          </CartProvider>
        </NotificationProvider>
      </AuthProvider>
    </AppProvider>
  );
};

export default App;
