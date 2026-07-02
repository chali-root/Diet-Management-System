import { useEffect, useRef } from 'react';
import { NavBar, Button, Card, Dialog, Toast } from 'antd-mobile';
import { useAppStore } from '@/store/store';
import LoadingView from '@/components/LoadingView';
import EmptyState from '@/components/EmptyState';
import { formatDateTime, formatFileSize } from '@/utils/format';

const ACCEPT = '.pdf,.txt';

export default function RecipeLibrary() {
  const fileRef = useRef<HTMLInputElement>(null);
  const { recipeDocs, recipeLoading, fetchRecipes, uploadRecipe, deleteRecipe } = useAppStore();

  useEffect(() => {
    fetchRecipes();
  }, [fetchRecipes]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await uploadRecipe(file);
    Toast.show({ content: '上传成功' });
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = (id: string, name: string) => {
    Dialog.confirm({
      content: `确认删除「${name}」？`,
      onConfirm: async () => {
        const ok = await deleteRecipe(id);
        if (ok) Toast.show({ content: '已删除' });
      },
    });
  };

  return (
    <div style={{ minHeight: '100vh', background: '#F5F5F5', paddingBottom: 60 }}>
      <NavBar back={null} style={{ background: '#FFF', borderBottom: '1px solid #EEE' }}>
        菜谱知识库
      </NavBar>

      <div style={{ padding: '12px' }}>
        <input
          ref={fileRef}
          type="file"
          accept={ACCEPT}
          onChange={handleUpload}
          style={{ display: 'none' }}
        />
        <Button
          block
          color="primary"
          onClick={() => fileRef.current?.click()}
          style={{ minHeight: 44, borderRadius: 8 }}
        >
          + 上传菜谱文档（PDF / TXT）
        </Button>
        <p style={{ fontSize: 12, color: '#999', margin: '8px 0 0', textAlign: 'center' }}>
          支持 PDF、TXT 格式
        </p>
      </div>

      {recipeLoading ? (
        <LoadingView />
      ) : recipeDocs.length === 0 ? (
        <EmptyState title="暂无菜谱文档" description="上传 PDF 或 TXT 菜谱文件开始构建知识库" />
      ) : (
        <div style={{ padding: '0 12px 12px' }}>
          {recipeDocs.map((doc) => (
            <Card
              key={doc.id}
              style={{ marginBottom: 10, borderRadius: 12 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: '#333', wordBreak: 'break-all' }}>
                    {doc.fileName}
                  </div>
                  <div style={{ fontSize: 12, color: '#999', marginTop: 6 }}>
                    <span>{formatDateTime(doc.uploadTime)}</span>
                    <span style={{ marginLeft: 12 }}>{formatFileSize(doc.fileSize)}</span>
                    <span style={{
                      marginLeft: 12,
                      padding: '1px 6px',
                      background: doc.fileType === 'pdf' ? '#FFF3E0' : '#E8F5E9',
                      color: doc.fileType === 'pdf' ? '#E65100' : '#2E7D32',
                      borderRadius: 4,
                      fontSize: 11,
                    }}>
                      {doc.fileType.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(doc.id, doc.fileName)}
                  style={{
                    minWidth: 44,
                    minHeight: 30,
                    border: '1px solid #FFCDD2',
                    background: '#FFF',
                    color: '#F44336',
                    borderRadius: 6,
                    fontSize: 12,
                    cursor: 'pointer',
                    flexShrink: 0,
                    marginLeft: 12,
                  }}
                >
                  删除
                </button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
