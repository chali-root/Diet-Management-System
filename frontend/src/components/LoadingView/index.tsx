import { SpinLoading } from 'antd-mobile';

interface Props {
  text?: string;
}

export default function LoadingView({ text = '加载中...' }: Props) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 240,
        gap: 16,
        padding: 24,
      }}
    >
      <SpinLoading color="primary" style={{ '--size': '36px' }} />
      <span style={{ fontSize: 14, color: '#999' }}>{text}</span>
    </div>
  );
}
