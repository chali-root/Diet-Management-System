import { ErrorBlock } from 'antd-mobile';

interface Props {
  title?: string;
  description?: string;
}

export default function EmptyState({
  title = '暂无数据',
  description = '当前没有可显示的内容',
}: Props) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 240,
        padding: 24,
      }}
    >
      <ErrorBlock status="empty" title={title} description={description} />
    </div>
  );
}
