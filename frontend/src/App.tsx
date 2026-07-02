import { BrowserRouter, useNavigate, useLocation } from 'react-router-dom';
import { TabBar, ConfigProvider } from 'antd-mobile';
import zhCN from 'antd-mobile/es/locales/zh-CN';
import AuthGuard from '@/components/AuthGuard';
import AppRoutes from '@/routes';

const tabs = [
  { key: '/recipe-library', title: '菜谱库' },
  { key: '/diet-config', title: '饮食配置' },
  { key: '/ai-plan', title: 'AI配餐' },
  { key: '/mine', title: '个人中心' },
];

function TabIcon({ active, type }: { active: boolean; type: string }) {
  const color = active ? '#4CAF50' : '#999';
  const d: Record<string, string> = {
    recipe:
      'M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9H9V9h10v2zm-4 4H9v-2h6v2zm4-8H9V5h10v2z',
    config:
      'M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 0 0 .12-.61l-1.92-3.32a.49.49 0 0 0-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 0 0-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 0 0-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z',
    ai: 'M21 10.5h-1.5V9h-1v1.5H17v1h1.5V13h1v-1.5H21v-1zm-7.5 1.5h-1.75l-.5-1.25h-2.5L8.25 12H6.5L9 5h2l2.5 7zM9.5 8.25L10.25 10h-1.5L9.5 8.25zM5 19h14v-2H5v2zm0-4h14v-2H5v2z',
    mine: 'M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z',
  };
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill={color}>
      <path d={d[type]} />
    </svg>
  );
}

function TabBarShell() {
  const navigate = useNavigate();
  const location = useLocation();
  // 不在 Tab 页时隐藏 TabBar（登录页、详情页等）
  const tabBarVisible = tabs.some((t) => t.key === location.pathname);

  return (
    <div className="app-container">
      <main className="app-main" style={{ paddingBottom: tabBarVisible ? 50 : 0 }}>
        <AppRoutes />
      </main>
      {tabBarVisible && (
        <div className="tab-bar-wrapper">
          <TabBar activeKey={location.pathname} onChange={(key) => navigate(key)} safeArea>
            {tabs.map((tab) => (
              <TabBar.Item
                key={tab.key}
                icon={(active: boolean) => (
                  <TabIcon
                    active={active}
                    type={
                      tab.key === '/recipe-library'
                        ? 'recipe'
                        : tab.key === '/diet-config'
                          ? 'config'
                          : tab.key === '/ai-plan'
                            ? 'ai'
                            : 'mine'
                    }
                  />
                )}
                title={
                  <span
                    style={{ fontSize: 10, color: location.pathname === tab.key ? '#4CAF50' : '#999' }}
                  >
                    {tab.title}
                  </span>
                }
              />
            ))}
          </TabBar>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ConfigProvider locale={zhCN}>
      <BrowserRouter>
        <AuthGuard>
          <TabBarShell />
        </AuthGuard>
      </BrowserRouter>
    </ConfigProvider>
  );
}
