import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Button, Input, Form, Toast } from 'antd-mobile';

export default function ChangePwd() {
  const navigate = useNavigate();
  const [oldPwd, setOldPwd] = useState('');
  const [newPwd, setNewPwd] = useState('');
  const [confirmPwd, setConfirmPwd] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!oldPwd.trim()) {
      Toast.show({ content: '请输入旧密码', icon: 'fail' });
      return;
    }
    if (!newPwd.trim()) {
      Toast.show({ content: '请输入新密码', icon: 'fail' });
      return;
    }
    if (newPwd.length < 6) {
      Toast.show({ content: '新密码至少 6 位', icon: 'fail' });
      return;
    }
    if (newPwd !== confirmPwd) {
      Toast.show({ content: '两次输入的新密码不一致', icon: 'fail' });
      return;
    }
    setLoading(true);
    // await changePwdApi({ oldPassword: oldPwd, newPassword: newPwd })
    await new Promise((r) => setTimeout(r, 600));
    setLoading(false);
    Toast.show({ content: '密码修改成功' });
    navigate(-1);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5' }}>
      <NavBar onBack={() => navigate(-1)} style={{ background: '#FFF', borderBottom: '1px solid #EEE' }}>
        修改密码
      </NavBar>

      <div style={{ background: '#FFF', margin: '10px 12px', borderRadius: 12, padding: '20px 16px' }}>
        <Form layout="vertical">
          <Form.Item label="旧密码">
            <Input
              placeholder="请输入旧密码"
              value={oldPwd}
              onChange={setOldPwd}
              type="password"
              clearable
              style={{ '--font-size': '15px', minHeight: 44 }}
            />
          </Form.Item>
          <Form.Item label="新密码">
            <Input
              placeholder="请输入新密码（至少6位）"
              value={newPwd}
              onChange={setNewPwd}
              type="password"
              clearable
              style={{ '--font-size': '15px', minHeight: 44 }}
            />
          </Form.Item>
          <Form.Item label="确认新密码">
            <Input
              placeholder="请再次输入新密码"
              value={confirmPwd}
              onChange={setConfirmPwd}
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
          onClick={handleSubmit}
          style={{ minHeight: 46, borderRadius: 10, fontWeight: 600, fontSize: 16, marginTop: 8 }}
        >
          确认修改
        </Button>
      </div>
    </div>
  );
}
