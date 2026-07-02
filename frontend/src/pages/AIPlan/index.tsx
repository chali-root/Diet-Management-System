import { NavBar, Button, Card, Toast } from 'antd-mobile';
import { useAppStore } from '@/store/store';
import LoadingView from '@/components/LoadingView';
import EmptyState from '@/components/EmptyState';
import { DIET_GOAL_LABELS } from '@/utils/constants';
import { formatDateTime } from '@/utils/format';
import type { MealItem } from '@/types';

const MEAL_LABELS: Record<string, string> = {
  breakfast: '早餐',
  lunch: '午餐',
  dinner: '晚餐',
};

export default function AIPlan() {
  const { currentPlan, planLoading, generatePlan, savePlan, clearPlan, dietConfig } = useAppStore();

  const handleSave = async () => {
    if (!currentPlan) return;
    await savePlan();
    Toast.show({ content: '方案已保存到历史记录' });
  };

  const renderMealItems = (items: MealItem[]) =>
    items.map((item) => (
      <div
        key={item.id}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '6px 0',
          fontSize: 13,
          borderBottom: '1px solid #F5F5F5',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: '#333' }}>{item.name}</span>
          <span
            style={{
              padding: '1px 6px',
              borderRadius: 4,
              fontSize: 10,
              background: item.isExisting ? '#E8F5E9' : '#FFF3E0',
              color: item.isExisting ? '#2E7D32' : '#E65100',
            }}
          >
            {item.isExisting ? '已有' : '待购'}
          </span>
        </div>
        <span style={{ color: '#999', fontSize: 11 }}>{item.ingredients.join('、')}</span>
      </div>
    ));

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', paddingBottom: 80 }}>
      <NavBar back={null} style={{ background: '#FFF', borderBottom: '1px solid #EEE' }}>
        AI 智能配餐
      </NavBar>

      {/* 生成按钮区域 */}
      <div style={{ background: '#FFF', padding: 16, marginBottom: 10 }}>
        <div style={{ fontSize: 13, color: '#666', marginBottom: 10 }}>
          饮食目标：<b>{DIET_GOAL_LABELS[dietConfig.goal]}</b>
          {dietConfig.restrictions.length > 0 && (
            <span> ｜ 忌口：{dietConfig.restrictions.join('、')}</span>
          )}
        </div>
        <Button
          block
          color="primary"
          size="large"
          loading={planLoading}
          onClick={generatePlan}
          style={{ minHeight: 48, borderRadius: 8, fontWeight: 600 }}
        >
          {planLoading ? 'AI 正在生成配餐方案...' : '生成配餐方案'}
        </Button>
        {currentPlan && (
          <div style={{ display: 'flex', gap: 10, marginTop: 10 }}>
            <Button
              block
              color="primary"
              fill="outline"
              onClick={handleSave}
              style={{ minHeight: 44 }}
            >
              保存方案
            </Button>
            <Button block fill="none" onClick={clearPlan} style={{ minHeight: 44 }}>
              清空
            </Button>
          </div>
        )}
      </div>

      {planLoading && (
        <div style={{ textAlign: 'center', padding: 48 }}>
          <LoadingView text="AI 正在分析食材并生成配餐方案..." />
        </div>
      )}

      {!planLoading && !currentPlan && (
        <EmptyState title="暂无配餐方案" description="请先配置饮食偏好，然后点击「生成配餐方案」按钮" />
      )}

      {currentPlan && !planLoading && (
        <>
          {/* 多日餐食明细 */}
          {currentPlan.days.map((day, di) => (
            <div key={di} style={{ marginBottom: 10 }}>
              <div
                style={{
                  background: '#4CAF50',
                  color: '#FFF',
                  padding: '8px 16px',
                  fontSize: 15,
                  fontWeight: 600,
                  margin: '0 12px',
                  borderRadius: '10px 10px 0 0',
                }}
              >
                第 {di + 1} 天
              </div>
              <Card style={{ margin: '0 12px', borderRadius: '0 0 12px 12px' }}>
                {(['breakfast', 'lunch', 'dinner'] as const).map((type) => (
                  <div key={type} style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#4CAF50', marginBottom: 4 }}>
                      {MEAL_LABELS[type]}
                    </div>
                    {day[type].length === 0 ? (
                      <span style={{ fontSize: 12, color: '#CCC' }}>未安排</span>
                    ) : (
                      renderMealItems(day[type])
                    )}
                  </div>
                ))}
              </Card>
            </div>
          ))}

          {/* 采购清单 */}
          {currentPlan.shoppingList.length > 0 && (
            <div style={{ margin: '0 12px 10px' }}>
              <Card style={{ borderRadius: 12, border: '2px solid #FF9800' }}>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#E65100', marginBottom: 12 }}>
                  🛒 需采购食材清单
                </div>
                {(() => {
                  const grouped: Record<string, typeof currentPlan.shoppingList> = {};
                  currentPlan.shoppingList.forEach((item) => {
                    (grouped[item.category] ??= []).push(item);
                  });
                  return Object.entries(grouped).map(([cat, items]) => (
                    <div key={cat} style={{ marginBottom: 8 }}>
                      <span style={{ fontSize: 12, color: '#999' }}>{cat}</span>
                      {items.map((item) => (
                        <div
                          key={item.name}
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            padding: '4px 0',
                            fontSize: 13,
                            borderBottom: '1px dashed #F0F0F0',
                          }}
                        >
                          <span>{item.name}</span>
                          <span style={{ color: '#666' }}>{item.amount}</span>
                        </div>
                      ))}
                    </div>
                  ));
                })()}
              </Card>
            </div>
          )}
        </>
      )}
    </div>
  );
}
