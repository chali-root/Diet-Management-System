import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Input, Form, Toast } from 'antd-mobile';
import { useAppStore } from '@/store/store';
import { getStoredToken } from '@/api/request';

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAppStore();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // 已登录直接跳首页
  const token = getStoredToken();
  if (token) {
    navigate('/recipe-library', { replace: true });
    return null;
  }

  const handleLogin = async () => {
    if (!username.trim()) {
      Toast.show({ content: '请输入账号', icon: 'fail' });
      return;
    }
    if (!password.trim()) {
      Toast.show({ content: '请输入密码', icon: 'fail' });
      return;
    }
    setLoading(true);
    const ok = await login({ username: username.trim(), password });
    setLoading(false);
    if (ok) {
      Toast.show({ content: '登录成功' });
      navigate('/recipe-library', { replace: true });
    } else {
      Toast.show({ content: '账号或密码错误', icon: 'fail' });
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)',
        padding: 24,
      }}
    >
      <div style={{ marginBottom: 40, textAlign: 'center' }}>
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            background: '#4CAF50',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
          }}
        >
          <svg width="36" height="36" viewBox="0 0 24 24" fill="#FFF">
            <path d="M18.06 23h1.66c.84 0 1.53-.65 1.63-1.47L23 5.05h-5V1h-1.97v4.05h-4.97l.3 2.34c1.71.47 3.31 1.32 4.27 2.26 1.44 1.42 2.43 2.89 2.43 5.29v8.06zM1 22v-1h15.03v1c0 .54-.45 1-1.03 1H2c-.55 0-1-.46-1-1zm15.03-7C16.03 9 1 10 1 15h15.03z" />
          </svg>
        </div>
        <h1 style={{ margin: 0, fontSize: 22, fontWeight: 700, color: '#2E7D32' }}>
          智能膳食搭配系统
        </h1>
        <p style={{ margin: '8px 0 0', fontSize: 13, color: '#66BB6A' }}>
          基于私有菜谱知识库的 AI 配餐助手
        </p>
      </div>

      <div
        style={{
          width: '100%',
          maxWidth: 360,
          background: '#FFF',
          borderRadius: 16,
          padding: '24px 20px',
          boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        }}
      >
        <Form layout="vertical">
          <Form.Item label="账号">
            <Input
              placeholder="请输入账号"
              value={username}
              onChange={setUsername}
              clearable
              style={{ '--font-size': '15px', minHeight: 44 }}
            />
          </Form.Item>
          <Form.Item label="密码">
            <Input
              placeholder="请输入密码"
              value={password}
              onChange={setPassword}
              type="password"
              clearable
              style={{ '--font-size': '15px', minHeight: 44 }}
            />
          </Form.Item>
        </Form>

        <Button
          block
          color="primary"
          loading={loading}
          onClick={handleLogin}
          style={{ minHeight: 46, borderRadius: 10, fontWeight: 600, fontSize: 16, marginTop: 8 }}
        >
          登 录
        </Button>
      </div>

      <p style={{ marginTop: 32, fontSize: 12, color: '#A5D6A7' }}>
        首次使用？任意输入账号密码即可注册登录
      </p>
    </div>
  );
}
