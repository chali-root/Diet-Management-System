# -*- coding: utf-8 -*-
# @Time : 2026/7/1 17:07
# @Author : 李柏涛
# @File : main.py
# @Project : Diet-Manager
# @Software: PyCharm
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="智能膳食管理系统后端接口")

# 配置跨域
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"msg": "FastAPI 服务运行正常，膳食系统后端就绪"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)