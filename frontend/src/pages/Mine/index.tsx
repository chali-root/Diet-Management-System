import { useNavigate } from 'react-router-dom';
import { NavBar, Card, List, Dialog, Toast } from 'antd-mobile';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAppStore } from '@/store/store';
import dayjs from 'dayjs';

const monthDays = Array.from({ length: 30 }, (_, i) => {
  const d = dayjs().subtract(29 - i, 'day');
  return {
    date: d.format('MM-DD'),
    calories: Math.round(1400 + Math.random() * 800),
  };
});

export default function Mine() {
  const navigate = useNavigate();
  const { user, logout } = useAppStore();

  const handleLogout = () => {
    Dialog.confirm({
      content: '确认退出登录？',
      onConfirm: () => {
        logout();
        Toast.show({ content: '已退出登录' });
        navigate('/login', { replace: true });
      },
    });
  };

  const handleClearCache = () => {
    Dialog.confirm({
      content: '确认清除本地缓存数据？这将清除所有本地存储。',
      onConfirm: () => {
        localStorage.clear();
        Toast.show({ content: '缓存已清除' });
      },
    });
  };

  const menuItems = [
    { title: '修改密码', onClick: () => navigate('/change-pwd') },
    { title: '清除本地缓存', onClick: handleClearCache },
    { title: '历史膳食方案', onClick: () => navigate('/meal-history') },
    { title: '关于系统', onClick: () => Toast.show({ content: '智能膳食搭配系统 v1.0' }) },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', paddingBottom: 60 }}>
      <NavBar back={null} style={{ background: '#FFF', borderBottom: '1px solid #EEE' }}>
        个人中心
      </NavBar>

      {/* 用户信息 */}
      <div
        style={{
          background: 'linear-gradient(135deg, #4CAF50, #66BB6A)',
          padding: '28px 20px',
          color: '#FFF',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 24,
            fontWeight: 700,
          }}
        >
          {user?.username?.charAt(0)?.toUpperCase() || 'U'}
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 600 }}>{user?.username || '未登录'}</div>
          <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>ID: {user?.id || '-'}</div>
        </div>
      </div>

      {/* 功能列表 */}
      <Card style={{ margin: '10px 12px', borderRadius: 12 }}>
        <List>
          {menuItems.map((item, i) => (
            <List.Item
              key={item.title}
              onClick={item.onClick}
              clickable
              style={i === menuItems.length - 1 ? {} : { borderBottom: '1px solid #F5F5F5' }}
            >
              <span style={{ fontSize: 15 }}>{item.title}</span>
            </List.Item>
          ))}
        </List>
      </Card>

      {/* 月度热量统计 */}
      <Card style={{ margin: '0 12px 10px', borderRadius: 12 }}>
        <div style={{ fontSize: 15, fontWeight: 600, color: '#333', marginBottom: 12 }}>
          近 30 天饮食热量趋势
        </div>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={monthDays}>
            <CartesianGrid strokeDasharray="3 3" stroke="#F0F0F0" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10 }}
              interval={4}
              stroke="#CCC"
            />
            <YAxis tick={{ fontSize: 10 }} stroke="#CCC" />
            <Tooltip
              formatter={(value: number) => [`${value} kcal`, '热量']}
              contentStyle={{ fontSize: 12, borderRadius: 8 }}
            />
            <Line
              type="monotone"
              dataKey="calories"
              stroke="#4CAF50"
              strokeWidth={2}
              dot={{ r: 0 }}
              activeDot={{ r: 4, fill: '#4CAF50' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>

      {/* 退出登录 */}
      <div style={{ padding: '12px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            minHeight: 44,
            border: '1px solid #FFCDD2',
            background: '#FFF',
            color: '#F44336',
            borderRadius: 10,
            fontSize: 15,
            fontWeight: 500,
            cursor: 'pointer',
          }}
        >
          退出登录
        </button>
      </div>
    </div>
  );
}
