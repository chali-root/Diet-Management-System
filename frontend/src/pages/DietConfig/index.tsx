import { useEffect } from 'react';
import { NavBar, Button, TextArea, Selector, Toast, Dialog } from 'antd-mobile';
import { useAppStore } from '@/store/store';
import LoadingView from '@/components/LoadingView';
import { RESTRICTION_OPTIONS, DIET_GOAL_OPTIONS, DEFAULT_DIET_CONFIG } from '@/utils/constants';
import type { DietGoal, Restriction } from '@/types';

export default function DietConfigPage() {
  const { dietConfig, dietLoading, saveDietConfig, updateDietConfig, resetDietConfig, fetchDietConfig } =
    useAppStore();

  useEffect(() => {
    fetchDietConfig();
  }, [fetchDietConfig]);

  const handleSave = async () => {
    if (!dietConfig.ingredients.trim()) {
      Toast.show({ content: '请填写现有食材', icon: 'fail' });
      return;
    }
    Dialog.confirm({
      content: '确认保存当前饮食配置？',
      onConfirm: async () => {
        await saveDietConfig({ ...dietConfig });
        Toast.show({ content: '配置已保存' });
      },
    });
  };

  const handleReset = () => {
    Dialog.confirm({
      content: '确认重置为默认配置？',
      onConfirm: () => {
        resetDietConfig();
        Toast.show({ content: '已重置' });
      },
    });
  };

  const selectedGoal = DIET_GOAL_OPTIONS.find((o) => o.value === dietConfig.goal);

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', paddingBottom: 80 }}>
      <NavBar back={null} style={{ background: '#FFF', borderBottom: '1px solid #EEE' }}>
        饮食配置
      </NavBar>

      {dietLoading ? (
        <LoadingView />
      ) : (
        <>
          {/* 现有食材 */}
          <div style={{ background: '#FFF', margin: '10px 0', padding: 16 }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 600 }}>家中现有食材</h3>
            <TextArea
              placeholder="请分行输入现有食材，如：&#10;鸡蛋、番茄、西兰花&#10;鸡胸肉、大米"
              value={dietConfig.ingredients}
              onChange={(val) => updateDietConfig({ ingredients: val })}
              rows={5}
              style={{ '--font-size': '14px' }}
            />
          </div>

          {/* 饮食忌口 */}
          <div style={{ background: '#FFF', margin: '10px 0', padding: 16 }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 600 }}>饮食忌口（多选）</h3>
            <Selector
              options={RESTRICTION_OPTIONS.map((r) => ({ value: r.value, label: r.label }))}
              value={dietConfig.restrictions}
              onChange={(vals) => {
                const prev = dietConfig.restrictions;
                if (vals.length === 0) {
                  updateDietConfig({ restrictions: [] });
                  return;
                }
                const added = vals.find((v) => !prev.includes(v as Restriction));
                const removed = prev.find((v) => !(vals as Restriction[]).includes(v));
                if (removed) {
                  updateDietConfig({ restrictions: prev.filter((r) => r !== removed) });
                } else if (added) {
                  updateDietConfig({ restrictions: [...prev, added as Restriction] });
                }
              }}
              multiple
              columns={3}
            />
          </div>

          {/* 饮食目标 */}
          <div style={{ background: '#FFF', margin: '10px 0', padding: 16 }}>
            <h3 style={{ margin: '0 0 10px', fontSize: 16, fontWeight: 600 }}>饮食目标（单选）</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {DIET_GOAL_OPTIONS.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => updateDietConfig({ goal: opt.value as DietGoal })}
                  style={{
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: dietConfig.goal === opt.value ? '2px solid #4CAF50' : '2px solid #EEE',
                    background: dietConfig.goal === opt.value ? '#E8F5E9' : '#FAFAFA',
                    cursor: 'pointer',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 15, fontWeight: 600, color: '#333' }}>{opt.label}</span>
                  <span style={{ fontSize: 12, color: '#999' }}>{opt.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* 底部按钮 */}
          <div
            style={{
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              background: '#FFF',
              borderTop: '1px solid #EEE',
              padding: '8px 12px',
              display: 'flex',
              gap: 12,
              zIndex: 100,
            }}
          >
            <Button block fill="none" onClick={handleReset} style={{ minHeight: 44 }}>
              重置表单
            </Button>
            <Button block color="primary" onClick={handleSave} style={{ minHeight: 44 }}>
              保存配置
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
