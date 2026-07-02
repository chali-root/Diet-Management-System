import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { NavBar, Button, Card, Dialog, Toast } from 'antd-mobile';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { useAppStore } from '@/store/store';
import LoadingView from '@/components/LoadingView';
import EmptyState from '@/components/EmptyState';
import { DIET_GOAL_LABELS } from '@/utils/constants';
import { formatDateTime } from '@/utils/format';

const WEEKDAY = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const PIE_COLORS = ['#4CAF50', '#FF9800', '#2196F3', '#9C27B0', '#F44336', '#00BCD4', '#FF5722'];

export default function MealHistory() {
  const navigate = useNavigate();
  const { mealHistory, historyLoading, fetchHistory, deleteHistory, updateDietConfig } = useAppStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const handleDelete = (id: string) => {
    Dialog.confirm({
      content: '确认删除该历史记录？',
      onConfirm: async () => {
        const ok = await deleteHistory(id);
        if (ok) Toast.show({ content: '已删除' });
      },
    });
  };

  const handleReuse = (record: (typeof mealHistory)[0]) => {
    updateDietConfig({
      ingredients: record.config.ingredients,
      restrictions: record.config.restrictions,
      goal: record.config.goal,
    });
    Toast.show({ content: '配置已回填，请前往饮食配置查看' });
    navigate('/diet-config');
  };

  // 近7天饼图数据
  const pieData = mealHistory
    .slice(0, 7)
    .map((r, i) => ({
      name: WEEKDAY[new Date(r.savedAt).getDay()],
      value: r.plan.days.reduce(
        (sum, d) =>
          sum +
          [...d.breakfast, ...d.lunch, ...d.dinner].reduce((s, m) => s + (m.name ? 1 : 0), 0),
        0,
      ),
    }))
    .reverse();

  const totalMeals = pieData.reduce((s, d) => s + d.value, 0);

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', paddingBottom: 60 }}>
      <NavBar back={null} style={{ background: '#FFF', borderBottom: '1px solid #EEE' }}>
        历史记录
      </NavBar>

      {historyLoading ? (
        <LoadingView />
      ) : mealHistory.length === 0 ? (
        <EmptyState title="暂无历史记录" description="保存的配餐方案将显示在这里" />
      ) : (
        <>
          {/* 周膳食分布饼图 */}
          <div style={{ background: '#FFF', margin: '10px 12px', borderRadius: 12, padding: 16 }}>
            <h3 style={{ margin: '0 0 8px', fontSize: 15, fontWeight: 600, textAlign: 'center' }}>
              近 7 天膳食分布
            </h3>
            {totalMeals === 0 ? (
              <div style={{ textAlign: 'center', padding: 24, color: '#999', fontSize: 13 }}>
                暂无餐食数据
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={80}
                    paddingAngle={4}
                    dataKey="value"
                    label={({ name, value }) => `${name} ${value}道`}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* 历史记录列表 */}
          <div style={{ padding: '0 12px 12px' }}>
            {mealHistory.map((record) => (
              <Card key={record.id} style={{ marginBottom: 10, borderRadius: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#333' }}>
                    {DIET_GOAL_LABELS[record.config.goal]} · 方案
                  </span>
                  <span style={{ fontSize: 12, color: '#999' }}>
                    {formatDateTime(record.savedAt)}
                  </span>
                </div>
                <div style={{ fontSize: 12, color: '#666', marginBottom: 10 }}>
                  {record.config.ingredients ? (
                    <span>食材：{record.config.ingredients.replace(/\n/g, '、').slice(0, 50)}{record.config.ingredients.length > 50 ? '...' : ''}</span>
                  ) : (
                    <span style={{ color: '#CCC' }}>未记录食材</span>
                  )}
                </div>
                <div style={{ display: 'flex', gap: 8 }}>
                  <Button
                    size="small"
                    color="primary"
                    fill="outline"
                    onClick={() => {
                      Toast.show({ content: '详情功能开发中' });
                    }}
                    style={{ minHeight: 36, fontSize: 12 }}
                  >
                    查看详情
                  </Button>
                  <Button
                    size="small"
                    onClick={() => handleReuse(record)}
                    style={{ minHeight: 36, fontSize: 12 }}
                  >
                    复用配置
                  </Button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    style={{
                      minWidth: 56,
                      minHeight: 36,
                      border: '1px solid #FFCDD2',
                      background: '#FFF',
                      color: '#F44336',
                      borderRadius: 16,
                      fontSize: 12,
                      cursor: 'pointer',
                      padding: '0 12px',
                    }}
                  >
                    删除
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
