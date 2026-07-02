# 移动端智能膳食管理系统后端

本后端固定使用 Python + FastAPI，当前只提供前后端连通测试所需的内存假数据接口，不接入 SQLite、ChromaDB 或其他持久化数据库。服务重启后，运行期新增或删除的数据会恢复为初始内存数据。

## 已适配前端请求

前端 Vite 代理配置为 `/api -> http://localhost:8080`，因此后端默认监听 `8080` 端口。

接口统一返回：

```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

已实现接口：

- `GET /api/health`
- `POST /api/user/login`
- `POST /api/user/change-pwd`
- `GET /api/diet-config`
- `POST /api/diet-config`
- `GET /api/recipes`
- `POST /api/recipes/upload`
- `DELETE /api/recipes/{recipe_id}`
- `POST /api/meal-plan/generate`
- `POST /api/meal-plan/save`
- `GET /api/meal-plan/history`
- `DELETE /api/meal-plan/history/{history_id}`

## Windows PowerShell 启动步骤

所有命令均在项目内已创建的虚拟环境 `diet-backend/venv` 中执行。

```powershell
cd D:\project\Diet-Manager\diet-backend
.\venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

如当前 PowerShell 禁止执行激活脚本，可直接使用虚拟环境内 Python：

```powershell
cd D:\project\Diet-Manager\diet-backend
.\venv\Scripts\python.exe -m pip install -r requirements.txt
.\venv\Scripts\python.exe -m uvicorn main:app --host 0.0.0.0 --port 8080 --reload
```

## 前后端联调

后端启动后，新开一个终端启动前端：

```powershell
cd D:\project\Diet-Manager\frontend
npm install
npm run dev
```

浏览器访问前端地址，一般为 `http://localhost:3000`。前端请求 `/api/...` 会由 Vite 转发到 `http://localhost:8080/api/...`。

也可以直接访问 FastAPI 文档验证接口：

- `http://localhost:8080/docs`
- `http://localhost:8080/api/health`

## 快速接口验证

```powershell
Invoke-RestMethod http://localhost:8080/api/health

Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:8080/api/user/login `
  -ContentType 'application/json' `
  -Body '{"username":"test","password":"123456"}'
```
