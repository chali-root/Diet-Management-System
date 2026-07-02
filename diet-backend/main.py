# -*- coding: utf-8 -*-
from __future__ import annotations

from datetime import datetime
from typing import Any, Literal
from uuid import uuid4

from fastapi import FastAPI, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field


Restriction = Literal["noSpicy", "noOnionGinger", "vegetarian", "noSeafood", "lowSugar"]
DietGoal = Literal["homeCook", "fatLoss", "stomach", "muscleGain"]
FileType = Literal["pdf", "txt"]


class ApiResponse(BaseModel):
    code: int = 0
    message: str = "success"
    data: Any = None


class LoginRequest(BaseModel):
    username: str
    password: str


class ChangePasswordRequest(BaseModel):
    oldPassword: str
    newPassword: str


class UserInfo(BaseModel):
    id: str
    username: str
    token: str


class RecipeDoc(BaseModel):
    id: str
    fileName: str
    fileType: FileType
    fileSize: int
    uploadTime: str


class DietConfig(BaseModel):
    ingredients: str = "鸡胸肉、西兰花、鸡蛋、燕麦、番茄"
    restrictions: list[Restriction] = Field(default_factory=list)
    goal: DietGoal = "homeCook"


class MealItem(BaseModel):
    id: str
    name: str
    isExisting: bool
    ingredients: list[str]


class DayMeal(BaseModel):
    breakfast: list[MealItem]
    lunch: list[MealItem]
    dinner: list[MealItem]


class ShoppingItem(BaseModel):
    name: str
    amount: str
    category: str


class GeneratedPlan(BaseModel):
    id: str
    days: list[DayMeal]
    shoppingList: list[ShoppingItem]
    generatedAt: str
    dietGoal: DietGoal


class MealHistoryRecord(BaseModel):
    id: str
    plan: GeneratedPlan
    savedAt: str
    config: DietConfig


class DishTemplate(BaseModel):
    name: str
    category: Literal["staple", "meat", "seafood", "veg", "soup"]
    conflicts: list[Restriction]
    ingredients: list[ShoppingItem]


app = FastAPI(title="移动端智能膳食管理系统后端接口", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


diet_config = DietConfig()
recipes: list[RecipeDoc] = [
    RecipeDoc(
        id="d1",
        fileName="家常红烧肉.pdf",
        fileType="pdf",
        fileSize=245000,
        uploadTime="2026-06-28T10:30:00",
    ),
    RecipeDoc(
        id="d2",
        fileName="减脂餐食谱合集.txt",
        fileType="txt",
        fileSize=12800,
        uploadTime="2026-06-29T14:20:00",
    ),
    RecipeDoc(
        id="d3",
        fileName="粤菜老火汤大全.pdf",
        fileType="pdf",
        fileSize=1800000,
        uploadTime="2026-06-30T09:15:00",
    ),
]
meal_history: list[MealHistoryRecord] = []


dish_pool: list[DishTemplate] = [
    DishTemplate(
        name="燕麦粥",
        category="staple",
        conflicts=[],
        ingredients=[ShoppingItem(name="燕麦", amount="100g", category="主食")],
    ),
    DishTemplate(
        name="水煮蛋",
        category="meat",
        conflicts=[],
        ingredients=[ShoppingItem(name="鸡蛋", amount="2个", category="蛋类")],
    ),
    DishTemplate(
        name="番茄豆腐汤",
        category="soup",
        conflicts=[],
        ingredients=[
            ShoppingItem(name="番茄", amount="2个", category="蔬菜"),
            ShoppingItem(name="豆腐", amount="1盒", category="豆制品"),
        ],
    ),
    DishTemplate(
        name="清炒时蔬",
        category="veg",
        conflicts=[],
        ingredients=[ShoppingItem(name="西兰花", amount="200g", category="蔬菜")],
    ),
    DishTemplate(
        name="鸡胸肉沙拉",
        category="meat",
        conflicts=["vegetarian", "noOnionGinger"],
        ingredients=[
            ShoppingItem(name="鸡胸肉", amount="200g", category="肉类"),
            ShoppingItem(name="生菜", amount="1颗", category="蔬菜"),
        ],
    ),
    DishTemplate(
        name="清蒸鲈鱼",
        category="seafood",
        conflicts=["vegetarian", "noSeafood", "noOnionGinger"],
        ingredients=[
            ShoppingItem(name="鲈鱼", amount="1条", category="水产"),
            ShoppingItem(name="姜丝", amount="少许", category="调料"),
        ],
    ),
    DishTemplate(
        name="牛肉面",
        category="meat",
        conflicts=["vegetarian", "noSpicy"],
        ingredients=[
            ShoppingItem(name="牛腱肉", amount="200g", category="肉类"),
            ShoppingItem(name="面条", amount="150g", category="主食"),
        ],
    ),
    DishTemplate(
        name="南瓜小米粥",
        category="staple",
        conflicts=["lowSugar"],
        ingredients=[
            ShoppingItem(name="南瓜", amount="200g", category="蔬菜"),
            ShoppingItem(name="小米", amount="80g", category="主食"),
        ],
    ),
    DishTemplate(
        name="香菇青菜",
        category="veg",
        conflicts=[],
        ingredients=[
            ShoppingItem(name="青菜", amount="300g", category="蔬菜"),
            ShoppingItem(name="香菇", amount="100g", category="蔬菜"),
        ],
    ),
    DishTemplate(
        name="冬瓜排骨汤",
        category="soup",
        conflicts=["vegetarian", "noOnionGinger"],
        ingredients=[
            ShoppingItem(name="排骨", amount="300g", category="肉类"),
            ShoppingItem(name="冬瓜", amount="500g", category="蔬菜"),
        ],
    ),
]


def ok(data: Any = None, message: str = "success") -> ApiResponse:
    return ApiResponse(code=0, message=message, data=data)


def now_iso() -> str:
    return datetime.now().isoformat(timespec="seconds")


def pick_dishes(categories: set[str], restrictions: list[Restriction], count: int) -> list[DishTemplate]:
    candidates = [
        dish
        for dish in dish_pool
        if dish.category in categories and not any(item in dish.conflicts for item in restrictions)
    ]
    if not candidates:
        candidates = [dish for dish in dish_pool if not any(item in dish.conflicts for item in restrictions)]
    return candidates[:count]


def build_plan(config: DietConfig) -> GeneratedPlan:
    goal_label = {
        "homeCook": "家常",
        "fatLoss": "减脂",
        "stomach": "养胃",
        "muscleGain": "增肌",
    }[config.goal]

    shopping_map: dict[str, ShoppingItem] = {}

    def meal_item(dish: DishTemplate, is_existing: bool) -> MealItem:
        if not is_existing:
            for ingredient in dish.ingredients:
                shopping_map.setdefault(ingredient.name, ingredient)
        return MealItem(
            id=f"m-{uuid4().hex[:8]}",
            name=f"{goal_label}{dish.name}",
            isExisting=is_existing,
            ingredients=[ingredient.name for ingredient in dish.ingredients],
        )

    days: list[DayMeal] = []
    for day_index in range(3):
        breakfast = pick_dishes({"staple", "meat"}, config.restrictions, 2)
        lunch = pick_dishes({"meat", "seafood", "veg"}, config.restrictions, 2)
        dinner = pick_dishes({"veg", "soup", "seafood"}, config.restrictions, 2)
        days.append(
            DayMeal(
                breakfast=[meal_item(dish, True) for dish in breakfast],
                lunch=[meal_item(dish, day_index % 2 == 0) for dish in lunch],
                dinner=[meal_item(dish, day_index % 2 == 1) for dish in dinner],
            )
        )

    return GeneratedPlan(
        id=f"plan-{uuid4().hex[:8]}",
        days=days,
        shoppingList=list(shopping_map.values()),
        generatedAt=now_iso(),
        dietGoal=config.goal,
    )


@app.get("/")
def root() -> dict[str, str]:
    return {"msg": "FastAPI service is running", "docs": "/docs", "api": "/api/health"}


@app.get("/api/health")
def health() -> ApiResponse:
    return ok({"status": "ok", "service": "diet-backend", "time": now_iso()})


@app.post("/api/user/login")
def login(payload: LoginRequest) -> ApiResponse:
    username = payload.username.strip()
    if not username or not payload.password.strip():
        raise HTTPException(status_code=400, detail="用户名和密码不能为空")
    return ok(UserInfo(id="u-001", username=username, token=f"mock-token-{uuid4().hex}"))


@app.post("/api/user/change-pwd")
def change_password(payload: ChangePasswordRequest) -> ApiResponse:
    if not payload.oldPassword.strip() or not payload.newPassword.strip():
        raise HTTPException(status_code=400, detail="旧密码和新密码不能为空")
    return ok(None, "密码修改成功")


@app.get("/api/diet-config")
def get_diet_config() -> ApiResponse:
    return ok(diet_config)


@app.post("/api/diet-config")
def save_diet_config(payload: DietConfig) -> ApiResponse:
    global diet_config
    diet_config = payload
    return ok(diet_config, "饮食配置已保存")


@app.get("/api/recipes")
def get_recipes() -> ApiResponse:
    return ok(recipes)


@app.post("/api/recipes/upload")
async def upload_recipe(file: UploadFile) -> ApiResponse:
    content = await file.read()
    file_name = file.filename or f"recipe-{uuid4().hex[:8]}.txt"
    file_type: FileType = "pdf" if file_name.lower().endswith(".pdf") else "txt"
    doc = RecipeDoc(
        id=f"d-{uuid4().hex[:8]}",
        fileName=file_name,
        fileType=file_type,
        fileSize=len(content),
        uploadTime=now_iso(),
    )
    recipes.insert(0, doc)
    return ok(doc, "菜谱上传成功")


@app.delete("/api/recipes/{recipe_id}")
def delete_recipe(recipe_id: str) -> ApiResponse:
    before = len(recipes)
    recipes[:] = [item for item in recipes if item.id != recipe_id]
    if len(recipes) == before:
        raise HTTPException(status_code=404, detail="菜谱不存在")
    return ok(None, "菜谱已删除")


@app.post("/api/meal-plan/generate")
def generate_meal_plan(config: DietConfig) -> ApiResponse:
    return ok(build_plan(config), "配餐方案已生成")


@app.post("/api/meal-plan/save")
def save_meal_plan(plan: GeneratedPlan) -> ApiResponse:
    record = MealHistoryRecord(
        id=f"h-{uuid4().hex[:8]}",
        plan=plan,
        savedAt=now_iso(),
        config=diet_config,
    )
    meal_history.insert(0, record)
    return ok(record, "配餐方案已保存")


@app.get("/api/meal-plan/history")
def get_meal_history() -> ApiResponse:
    if not meal_history:
        sample_plan = build_plan(diet_config)
        meal_history.extend(
            [
                MealHistoryRecord(
                    id="h1",
                    plan=sample_plan,
                    savedAt="2026-07-01T08:00:00",
                    config=diet_config,
                )
            ]
        )
    return ok(meal_history)


@app.delete("/api/meal-plan/history/{history_id}")
def delete_meal_history(history_id: str) -> ApiResponse:
    before = len(meal_history)
    meal_history[:] = [item for item in meal_history if item.id != history_id]
    if len(meal_history) == before:
        raise HTTPException(status_code=404, detail="历史记录不存在")
    return ok(None, "历史记录已删除")


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8080, reload=True)
