from pathlib import Path  # для работы с путями к файлам/папкам
from fastapi import FastAPI, HTTPException  # FastAPI — основной фреймворк, HTTPException — для ошибок
from fastapi.middleware.cors import CORSMiddleware  # для разрешения запросов с другого домена (например, с HTML-страницы)
from pydantic import BaseModel  # для валидации входных данных
import xml.etree.ElementTree as ET  # встроенный модуль для работы с XML
import os  # для создания директорий и работы с файловой системой

# Инициализация приложения FastAPI
app = FastAPI()

# Добавляем middleware для поддержки CORS — разрешаем запросы с любых источников
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # можно ограничить, например, только ['http://localhost:8080']
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Путь к директории и XML-файлу
XML_DIR = Path("data")
REGISTRATION_XML_FILE = XML_DIR / "registrations.xml"
RECOMENDATION_XML_FILE = XML_DIR / "recomendations.xml"
os.makedirs(XML_DIR, exist_ok=True)  # создаём папку, если её нет


# Описание модели регистрации
class Registration(BaseModel):
    name: str
    phone: str
    email: str
    difficulty: str


class Recomendation(BaseModel):
    rec: str

    
# Функция для создания/очистки XML-файла при запуске сервера
def init_registration_xml_file():
    root = ET.Element("registrations")  # создаём корневой элемент
    tree = ET.ElementTree(root)
    indent(root)  # форматируем отступы
    tree.write(REGISTRATION_XML_FILE, encoding="utf-8", xml_declaration=True)


def init_recomendation_xml_file():
    root = ET.Element("recomendations")  # создаём корневой элемент
    tree = ET.ElementTree(root)
    indent(root)  # форматируем отступы
    tree.write(RECOMENDATION_XML_FILE, encoding="utf-8", xml_declaration=True)


# Вызываем инициализацию XML при старте сервера
@app.on_event("startup")
def reset_xml_on_startup():
    init_registration_xml_file()
    init_recomendation_xml_file()


# Функция для "красивого" форматирования XML-файла
def indent(elem, level=0):
    i = "\n" + level * "  "
    if len(elem):
        if not elem.text or not elem.text.strip():
            elem.text = i + "  "
        for child in elem:
            indent(child, level + 1)
        if not child.tail or not child.tail.strip():
            child.tail = i
    if level and (not elem.tail or not elem.tail.strip()):
        elem.tail = i
    return elem


# Эндпоинт для сохранения данных регистрации
@app.post("/api/save-recomendations")
async def save_recomendations(recomendation: Recomendation):
    try:
        rec_tree = ET.parse(RECOMENDATION_XML_FILE)
        rec_root = rec_tree.getroot()
        ET.SubElement(rec_root, "recomendation").text = recomendation.rec
        indent(rec_root)
        rec_tree.write(RECOMENDATION_XML_FILE, encoding="utf-8", xml_declaration=True)

        return {"status": "success"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@app.post("/api/save-registration")
async def save_registration(registration: Registration):
    try:
        #СОЗДАЕМ дерево xml-файла
        
        reg_tree = ET.parse(REGISTRATION_XML_FILE)

        
        reg_root = reg_tree.getroot()
        
        # Создаём новый элемент регистрации
        new_reg = ET.SubElement(reg_root, "registration")
        ET.SubElement(new_reg, "name").text = registration.name
        ET.SubElement(new_reg, "phone").text = registration.phone
        ET.SubElement(new_reg, "email").text = registration.email
        ET.SubElement(new_reg, "difficulty").text = registration.difficulty

        indent(reg_root)  # форматируем отступы
        reg_tree.write(REGISTRATION_XML_FILE, encoding="utf-8", xml_declaration=True)

        return {"status": "success"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

