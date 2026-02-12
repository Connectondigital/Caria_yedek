from fastapi import FastAPI, APIRouter, HTTPException, Depends, File, UploadFile, Request
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
import os
import shutil
import logging
from pathlib import Path
from pydantic import BaseModel
from typing import List, Optional
import uuid
import sqlite3
import json
from typing import List, Optional, Any, Union

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

app = FastAPI(title="Caria Estates API", version="1.1.0")

# Configure CORS (Robust for Local Development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:3001"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ensure uploads directory exists
UPLOAD_DIR = ROOT_DIR / "static" / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# Mount static files
app.mount("/static", StaticFiles(directory=ROOT_DIR / "static"), name="static")

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

DB_PATH = ROOT_DIR / 'caria.db'

STATIC_FEATURES = [
    # DIŞ ÖZELLİKLER
    {"id": 1, "category": "Dış Özellikler", "title_tr": "Barbekü", "title_en": "BBQ", "is_active": True, "sort_order": 1},
    {"id": 2, "category": "Dış Özellikler", "title_tr": "Güvenlik Kamerası", "title_en": "Security Camera", "is_active": True, "sort_order": 2},
    {"id": 3, "category": "Dış Özellikler", "title_tr": "Teras", "title_en": "Terrace", "is_active": True, "sort_order": 3},
    {"id": 4, "category": "Dış Özellikler", "title_tr": "Çift Cam", "title_en": "Double Glazing", "is_active": True, "sort_order": 4},
    {"id": 5, "category": "Dış Özellikler", "title_tr": "Garaj", "title_en": "Garage", "is_active": True, "sort_order": 5},
    {"id": 6, "category": "Dış Özellikler", "title_tr": "Bahçe", "title_en": "Garden", "is_active": True, "sort_order": 6},
    {"id": 7, "category": "Dış Özellikler", "title_tr": "Asansör", "title_en": "Elevator", "is_active": True, "sort_order": 7},
    {"id": 8, "category": "Dış Özellikler", "title_tr": "Jeneratör", "title_en": "Generator", "is_active": True, "sort_order": 8},
    {"id": 9, "category": "Dış Özellikler", "title_tr": "Otopark (Açık/Kapalı)", "title_en": "Parking (Open/Closed)", "is_active": True, "sort_order": 9},
    {"id": 10, "category": "Dış Özellikler", "title_tr": "Havuz (Özel/Ortak)", "title_en": "Pool (Private/Shared)", "is_active": True, "sort_order": 10},
    {"id": 11, "category": "Dış Özellikler", "title_tr": "Isı Yalıtımı", "title_en": "Thermal Insulation", "is_active": True, "sort_order": 11},
    
    # İÇ ÖZELLİKLER
    {"id": 12, "category": "İç Özellikler", "title_tr": "Klima", "title_en": "Air Conditioning", "is_active": True, "sort_order": 12},
    {"id": 13, "category": "İç Özellikler", "title_tr": "Ebeveyn WC", "title_en": "En-suite WC", "is_active": True, "sort_order": 13},
    {"id": 14, "category": "İç Özellikler", "title_tr": "Vestiyer", "title_en": "Cloakroom", "is_active": True, "sort_order": 14},
    {"id": 15, "category": "İç Özellikler", "title_tr": "Panjur", "title_en": "Shutters", "is_active": True, "sort_order": 15},
    {"id": 16, "category": "İç Özellikler", "title_tr": "Ankastre Mutfak", "title_en": "Built-in Kitchen", "is_active": True, "sort_order": 16},
    {"id": 17, "category": "İç Özellikler", "title_tr": "Gömme Dolap", "title_en": "Built-in Wardrobe", "is_active": True, "sort_order": 17},
    {"id": 18, "category": "İç Özellikler", "title_tr": "Parke", "title_en": "Parquet", "is_active": True, "sort_order": 18},
    {"id": 19, "category": "İç Özellikler", "title_tr": "Diafon", "title_en": "Intercom", "is_active": True, "sort_order": 19},
    {"id": 20, "category": "İç Özellikler", "title_tr": "Balkon", "title_en": "Balcony", "is_active": True, "sort_order": 20},
    {"id": 21, "category": "İç Özellikler", "title_tr": "Küvet", "title_en": "Bathtub", "is_active": True, "sort_order": 21},
    {"id": 22, "category": "İç Özellikler", "title_tr": "Şömine", "title_en": "Fireplace", "is_active": True, "sort_order": 22},
    {"id": 23, "category": "İç Özellikler", "title_tr": "Duş", "title_en": "Shower", "is_active": True, "sort_order": 23},
    {"id": 24, "category": "İç Özellikler", "title_tr": "Mutfak Doğalgazı", "title_en": "Kitchen Natural Gas", "is_active": True, "sort_order": 24},
    
    # KONUM / ÇEVRE
    {"id": 25, "category": "Konum / Çevre", "title_tr": "Deniz Manzarası", "title_en": "Sea View", "is_active": True, "sort_order": 25},
    {"id": 26, "category": "Konum / Çevre", "title_tr": "Dağ Manzarası", "title_en": "Mountain View", "is_active": True, "sort_order": 26},
    {"id": 27, "category": "Konum / Çevre", "title_tr": "Şehir İçi", "title_en": "City Center", "is_active": True, "sort_order": 27},
    {"id": 28, "category": "Konum / Çevre", "title_tr": "Doğa Manzarası", "title_en": "Nature View", "is_active": True, "sort_order": 28},
    {"id": 29, "category": "Konum / Çevre", "title_tr": "Kuzey Cepheli", "title_en": "North Facing", "is_active": True, "sort_order": 29},
    {"id": 30, "category": "Konum / Çevre", "title_tr": "Güney Cepheli", "title_en": "South Facing", "is_active": True, "sort_order": 30},
    {"id": 31, "category": "Konum / Çevre", "title_tr": "Batı Cepheli", "title_en": "West Facing", "is_active": True, "sort_order": 31},
    {"id": 32, "category": "Konum / Çevre", "title_tr": "Doğu Cepheli", "title_en": "East Facing", "is_active": True, "sort_order": 32},
]

STATIC_ADVISORS = [
    {
        "id": 1, 
        "name": "Pilar Anguita", 
        "fullName": "Pilar Anguita", 
        "slug": "pilar-anguita",
        "title_tr": "Lüks Gayrimenkul Danışmanı",
        "title_en": "Luxury Real Estate Advisor",
        "email": "pilar@cariaestates.com",
        "phone": "+90 548 000 0001",
        "portraitUrl": "pilar-anguita.jpg",
        "isActive": True
    },
    {
        "id": 2, 
        "name": "Hakan Okur", 
        "fullName": "Hakan Okur", 
        "slug": "hakan-okur",
        "title_tr": "Kıdemli Satış Temsilcisi",
        "title_en": "Senior Sales Associate",
        "email": "hakan@cariaestates.com",
        "phone": "+90 548 000 0002",
        "portraitUrl": "hakan-okur.png",
        "isActive": True
    },
    {
        "id": 3, 
        "name": "Elena Petrova", 
        "fullName": "Elena Petrova", 
        "slug": "elena-petrova",
        "title_tr": "Yatırım Danışmanı",
        "title_en": "Investment Advisor",
        "email": "elena@cariaestates.com",
        "phone": "+90 548 000 0003",
        "portraitUrl": "elena-petrova.jpg",
        "isActive": True
    }
]

# Database Connection Helper
def get_db():
    conn = sqlite3.connect(DB_PATH, check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()


# Helper function to map new field names to legacy ones for frontend compatibility
def map_property_fields(prop):
    """Maps beds_room_count, baths_count, closed_area to beds, baths, area for frontend"""
    # Parse beds from beds_room_count (e.g., "3+1" -> 3)
    beds_room = prop.get('beds_room_count', '')
    if beds_room and isinstance(beds_room, str) and '+' in beds_room:
        try:
            prop['beds'] = int(beds_room.split('+')[0])
        except:
            prop['beds'] = prop.get('beds', 0)
    elif beds_room:
        try:
            prop['beds'] = int(beds_room)
        except:
            prop['beds'] = prop.get('beds', 0)
    
    # Parse baths from baths_count
    baths_count = prop.get('baths_count', '')
    if baths_count:
        try:
            prop['baths'] = int(baths_count)
        except:
            prop['baths'] = prop.get('baths', 0)
    
    # Map closed_area to area
    closed_area = prop.get('closed_area', '')
    if closed_area:
        prop['area'] = closed_area
    
    return prop

# Models
class LoginRequest(BaseModel):
    email: str
    password: str

class SliderItem(BaseModel):
    title: str
    image_url: str
    link: Optional[str] = "#"
    display_order: int = 0
    active: bool = True

class SiteContent(BaseModel):
    content_key: str
    value_tr: str
    value_en: Optional[str] = ""
    section: str

class CountryGuide(BaseModel):
    id: Optional[int] = None
    country_name_tr: str
    country_name_en: Optional[str] = ""
    content_tr: Optional[str] = ""
    content_en: Optional[str] = ""
    image_url: Optional[str] = ""
    slug: str

class SEOSetting(BaseModel):
    id: Optional[int] = None
    page_name: str
    title_tr: Optional[str] = ""
    title_en: Optional[str] = ""
    description_tr: Optional[str] = ""
    description_en: Optional[str] = ""
    keywords_tr: Optional[str] = ""
    keywords_en: Optional[str] = ""

class Page(BaseModel):
    id: Optional[int] = None
    title: str
    slug: str
    content_html: Optional[str] = ""
    banner_title: Optional[str] = ""
    banner_url: Optional[str] = ""
    active: int = 1
    gallery_json: Optional[str] = "[]"

class HomepageBlock(BaseModel):
    id: Optional[int] = None
    block_type: str
    title: Optional[str] = ""
    subtitle: Optional[str] = ""
    content: Optional[str] = ""
    image_url: Optional[str] = ""
    video_url: Optional[str] = ""
    display_order: int = 0
    active: bool = True

class Advisor(BaseModel):
    id: Optional[int] = None
    name: str = ""
    slug: str = ""
    title_tr: str = ""
    title_en: str = ""
    email: str = ""
    phone: str = ""
    whatsappPhone: str = ""
    portraitUrl: str = ""
    coverImageUrl: str = ""
    bioRichTextTR: str = ""
    bioRichTextEN: str = ""
    languages: str = ""
    regions: str = ""
    specialties: str = ""
    socialLinks: str = "{}"
    isActive: bool = True

# Helper to seed initial pages if missing
def seed_initial_pages(db):
    cursor = db.cursor()
    initial_pages = [
        ("Anasayfa", "home", "<h1>Hoşgeldiniz</h1>", "Caria Estates'e Hoşgeldiniz", "/assets/hero-video.mp4"),
        ("Hakkımızda", "about", "<p>Caria Estates hakkında...</p>", "Biz Kimiz?", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c"),
        ("Hizmetlerimiz", "services", "<ul><li>Gayrimenkul Danışmanlığı</li></ul>", "Hizmetlerimiz", "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9"),
        ("Satın Al", "buy", "<p>Satılık portföyümüz...</p>", "Gayrimenkul Satın Al", "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c"),
        ("Kirala", "rent", "<p>Kiralık ilanlarımız...</p>", "Kiralık Gayrimenkuller", "https://images.unsplash.com/photo-1613490493576-7fde63acd811"),
        ("İletişim", "contact", "<p>Bize ulaşın...</p>", "İletişime Geçin", "https://images.unsplash.com/photo-1628744276664-2d03a9baecaa"),
    ]
    for title, slug, content, b_title, b_url in initial_pages:
        cursor.execute("SELECT id FROM pages WHERE slug = ?", (slug,))
        if not cursor.fetchone():
            cursor.execute("""
                INSERT INTO pages (title, slug, content_html, banner_title, banner_url)
                VALUES (?, ?, ?, ?, ?)
            """, (title, slug, content, b_title, b_url))
    db.commit()

class Menu(BaseModel):
    id: Optional[int] = None
    title: str
    url: str
    menu_type: str = "header"
    display_order: int = 0

class Inquiry(BaseModel):
    id: Optional[int] = None
    name: str
    email: str
    phone: Optional[str] = ""
    message: Optional[str] = ""
    property_id: Optional[int] = None
    status: Optional[str] = "new"

class PropertyFeature(BaseModel):
    id: Optional[int] = None
    category: str
    title_tr: str
    title_en: str
    is_active: bool = True
    sort_order: int = 0

class Property(BaseModel):
    id: Optional[int] = None
    slug: str
    title: str
    location: Optional[str] = ""
    price: Optional[str] = ""
    beds: Optional[int] = 0
    baths: Optional[int] = 0
    area: Optional[str] = ""
    plotSize: Optional[str] = ""
    reference: Optional[str] = ""
    image: Optional[str] = ""
    featured_image: Optional[str] = ""
    tag: Optional[str] = ""
    region: Optional[str] = ""
    kocan_tipi: Optional[str] = ""
    ozellikler_ic: Optional[Any] = "[]"
    ozellikler_dis: Optional[Any] = "[]"
    ozellikler_konum: Optional[Any] = "[]"
    pdf_brosur: Optional[str] = ""
    advisor_id: Optional[int] = None
    status: Optional[str] = "active"
    description: Optional[str] = ""
    description_en: Optional[str] = ""
    beds_room_count: Optional[str] = "1"
    baths_count: Optional[str] = "1"
    plot_area: Optional[str] = ""
    closed_area: Optional[str] = ""
    is_featured: bool = False
    title_en: Optional[str] = ""
    balcony: Optional[str] = ""
    distance_sea: Optional[str] = ""
    distance_center: Optional[str] = ""
    distance_airport: Optional[str] = ""
    gallery: Optional[str] = "[]"
    property_type: Optional[str] = "Villa"
    is_furnished: Optional[str] = "Hayır"
    building_age: Optional[str] = "0"
    floor_level: Optional[str] = "1"
    site_within: Optional[str] = "Hayır"
    is_featured_slider: bool = False
    distance_hospital: Optional[str] = ""
    distance_school: Optional[str] = ""
    full_address: Optional[str] = ""
    neighborhood: Optional[str] = ""
    city: Optional[str] = ""
    country_name: Optional[str] = ""
    latitude: Optional[str] = ""
    longitude: Optional[str] = ""

# Routes
api_router = APIRouter(prefix="/api")

@api_router.get("/")
async def root():
    return {"status": "online", "message": "Caria Estates API (SQLite)"}

@api_router.get("/properties")
async def get_properties(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM listings")
    rows = cursor.fetchall()
    properties = [dict(row) for row in rows]
    
    # Manually merge static advisor data and map fields
    for prop in properties:
        # Map new field names to legacy ones for frontend compatibility
        map_property_fields(prop)
        
        advisor_id = prop.get('advisor_id')
        if advisor_id:
            advisor = next((a for a in STATIC_ADVISORS if a['id'] == advisor_id), None)
            if advisor:
                prop['advisor_name'] = advisor.get('fullName')
                prop['advisor_portrait'] = advisor.get('portraitUrl')
                prop['advisor_slug'] = advisor.get('slug')
                prop['advisor'] = advisor

    return properties

@api_router.post("/properties")
async def add_property(item: Property, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        
        # 1. Fetch actual column names from the database
        cursor.execute("PRAGMA table_info(listings)")
        db_cols = [r[1] for r in cursor.fetchall()]

        # 2. Prepare data mapping
        def ensure_json(val):
            if val is None: return "[]"
            if isinstance(val, (list, dict)):
                return json.dumps(val)
            return str(val)

        # Build a dictionary of all potential fields from the item
        full_data = item.dict()
        
        # Special handling for JSON fields
        json_fields = ['ozellikler_ic', 'ozellikler_dis', 'ozellikler_konum', 'gallery']
        for field in json_fields:
            if field in full_data:
                full_data[field] = ensure_json(full_data[field])

        # Filter out fields that don't exist in the DB
        valid_data = {k: v for k, v in full_data.items() if k in db_cols and k != 'id'}
        
        if item.id:
            # UPDATE flow
            columns = ", ".join([f"{k}=?" for k in valid_data.keys()])
            values = list(valid_data.values()) + [item.id]
            logger.info(f"Updating property ID {item.id} with columns: {list(valid_data.keys())}")
            cursor.execute(f"UPDATE listings SET {columns} WHERE id=?", values)
        else:
            # INSERT flow
            columns = ", ".join(valid_data.keys())
            placeholders = ", ".join(["?" for _ in valid_data])
            values = list(valid_data.values())
            logger.info(f"Inserting new property with columns: {list(valid_data.keys())}")
            cursor.execute(f"INSERT INTO listings ({columns}) VALUES ({placeholders})", values)
            
        db.commit()
        return {"status": "success", "id": cursor.lastrowid if not item.id else item.id}
    except Exception as e:
        logger.error(f"Error in add_property: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

@api_router.get("/properties/{slug}")
async def get_property(slug: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM listings WHERE slug=?", (slug,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Property not found")
    
    prop = dict(row)
    # Map new field names to legacy ones for frontend compatibility
    map_property_fields(prop)
    
    if prop.get('advisor_id'):
        cursor.execute("SELECT * FROM advisors WHERE id=?", (prop['advisor_id'],))
        adv = cursor.fetchone()
        if adv:
            prop['advisor'] = dict(adv)
    return prop

@api_router.delete("/properties/{id}")
async def delete_property(id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM listings WHERE id=?", (id,))
    db.commit()
    return {"status": "success"}

# Inquiry Endpoints
@api_router.get("/inquiries")
async def get_inquiries(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM inquiries ORDER BY created_at DESC")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@api_router.post("/inquiries")
async def add_inquiry(item: Inquiry, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO inquiries (name, email, phone, message, property_id, status)
        VALUES (?, ?, ?, ?, ?, ?)
    """, (item.name, item.email, item.phone, item.message, item.property_id, item.status))
    db.commit()
    return {"status": "success", "id": cursor.lastrowid}

@api_router.post("/upload")
async def upload_file(request: Request, file: UploadFile = File(...)):
    file_extension = Path(file.filename).suffix
    unique_filename = f"{uuid.uuid4()}{file_extension}"
    file_path = UPLOAD_DIR / unique_filename
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # Return the relative URL for the admin/frontend to use
    url = f"/static/uploads/{unique_filename}"
    return {"url": url}

@api_router.delete("/inquiries/{id}")
async def delete_inquiry(id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM inquiries WHERE id=?", (id,))
    db.commit()
    return {"status": "success"}

# Feature Definitions Endpoints
@api_router.get("/cms/features")
async def get_features():
    """Returns the static features list."""
    return STATIC_FEATURES

@api_router.post("/cms/features")
async def save_feature(item: PropertyFeature):
    """Dummy endpoint - features are now static."""
    return {"status": "success", "message": "Static mode: Change ignored"}

@api_router.delete("/cms/features/{id}")
async def delete_feature(id: int):
    """Dummy endpoint - features are now static."""
    return {"status": "success", "message": "Static mode: Delete ignored"}

@api_router.post("/auth/signin")
async def login(request: LoginRequest):
    if request.email == "admin@cariaestates.com" and request.password == "123456":
        return {
            "status": "success",
            "data": {
                "token": "fake-jwt-token",
                "user": {
                    "email": request.email,
                    "name": "Admin User",
                    "role": "admin"
                }
            }
        }
    raise HTTPException(status_code=401, detail="Geçersiz e-posta veya şifre")

# CMS Endpoints
@api_router.get("/cms/sliders")
async def get_sliders(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM sliders WHERE active = 1 ORDER BY display_order")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@api_router.post("/cms/sliders")
async def add_slider(item: SliderItem, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("INSERT INTO sliders (title, image_url, link, display_order, active) VALUES (?, ?, ?, ?, ?)",
                   (item.title, item.image_url, item.link, item.display_order, item.active))
    db.commit()
    return {"status": "success", "id": cursor.lastrowid}

@api_router.get("/cms/content")
async def get_content(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM site_content")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@api_router.post("/cms/content")
@api_router.post("/cms/update")
async def update_content(item: SiteContent, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO site_content (content_key, value_tr, value_en, section)
        VALUES (?, ?, ?, ?)
        ON CONFLICT(content_key) DO UPDATE SET
        value_tr=excluded.value_tr,
        value_en=excluded.value_en,
        section=excluded.section
    """, (item.content_key, item.value_tr, item.value_en, item.section))
    db.commit()
    return {"status": "success"}

# Country Guides Endpoints
@api_router.get("/cms/country-guides")
async def get_country_guides(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM country_guides")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@api_router.post("/cms/country-guides")
async def update_country_guide(item: CountryGuide, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    if item.id:
        cursor.execute("""
            UPDATE country_guides SET 
            country_name_tr=?, country_name_en=?, content_tr=?, content_en=?, image_url=?, slug=?
            WHERE id=?
        """, (item.country_name_tr, item.country_name_en, item.content_tr, item.content_en, item.image_url, item.slug, item.id))
    else:
        cursor.execute("""
            INSERT INTO country_guides (country_name_tr, country_name_en, content_tr, content_en, image_url, slug)
            VALUES (?, ?, ?, ?, ?, ?)
        """, (item.country_name_tr, item.country_name_en, item.content_tr, item.content_en, item.image_url, item.slug))
    db.commit()
    return {"status": "success"}

# SEO Settings Endpoints
@api_router.get("/cms/seo")
async def get_seo_settings(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM seo_settings")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@api_router.post("/cms/seo")
async def update_seo_settings(item: SEOSetting, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        INSERT INTO seo_settings (page_name, title_tr, title_en, description_tr, description_en, keywords_tr, keywords_en)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON CONFLICT(page_name) DO UPDATE SET
        title_tr=excluded.title_tr,
        title_en=excluded.title_en,
        description_tr=excluded.description_tr,
        description_en=excluded.description_en,
        keywords_tr=excluded.keywords_tr,
        keywords_en=excluded.keywords_en
    """, (item.page_name, item.title_tr, item.title_en, item.description_tr, item.description_en, item.keywords_tr, item.keywords_en))
    db.commit()
    return {"status": "success"}

# Dynamic Pages Endpoints
@api_router.get("/cms/pages")
async def get_pages(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM pages ORDER BY created_at DESC")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@api_router.get("/cms/pages/{slug}")
@api_router.get("/pages/{slug}")
async def get_page_by_slug(slug: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM pages WHERE slug = ?", (slug,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Page not found")
    return dict(row)

@api_router.post("/cms/pages")
async def save_page(item: Page, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    if item.id:
        cursor.execute("""
            UPDATE pages SET title=?, slug=?, content_html=?, banner_title=?, banner_url=?, active=?, gallery_json=?, updated_at=CURRENT_TIMESTAMP
            WHERE id=?
        """, (item.title, item.slug, item.content_html, item.banner_title, item.banner_url, item.active, item.gallery_json, item.id))
    else:
        cursor.execute("""
            INSERT INTO pages (title, slug, content_html, banner_title, banner_url, active, gallery_json)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        """, (item.title, item.slug, item.content_html, item.banner_title, item.banner_url, item.active, item.gallery_json))
    db.commit()
    return {"status": "success", "id": cursor.lastrowid if not item.id else item.id}

@api_router.delete("/cms/pages/{id}")
async def delete_page(id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM pages WHERE id=?", (id,))
    db.commit()
    return {"status": "success"}

# Menu Endpoints
@api_router.get("/cms/menus")
async def get_menus(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM menus ORDER BY display_order ASC")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@api_router.post("/cms/menus")
async def save_menu(item: Menu, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    if item.id:
        cursor.execute("""
            UPDATE menus SET title=?, url=?, menu_type=?, display_order=?
            WHERE id=?
        """, (item.title, item.url, item.menu_type, item.display_order, item.id))
    else:
        cursor.execute("""
            INSERT INTO menus (title, url, menu_type, display_order)
            VALUES (?, ?, ?, ?)
        """, (item.title, item.url, item.menu_type, item.display_order))
    db.commit()
    return {"status": "success", "id": cursor.lastrowid if not item.id else item.id}

@api_router.delete("/cms/menus/{id}")
async def delete_menu(id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM menus WHERE id=?", (id,))
    db.commit()
    return {"status": "success"}

# Homepage Blocks Endpoints
@api_router.get("/cms/homepage")
@api_router.get("/homepage/blocks")
async def get_homepage_blocks(db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM homepage_blocks WHERE active = 1 ORDER BY display_order ASC")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@api_router.post("/cms/homepage")
@api_router.post("/homepage/blocks")
async def save_homepage_block(item: HomepageBlock, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    if item.id:
        cursor.execute("""
            UPDATE homepage_blocks SET 
            block_type=?, title=?, subtitle=?, content=?, image_url=?, video_url=?, display_order=?, active=?, updated_at=CURRENT_TIMESTAMP
            WHERE id=?
        """, (item.block_type, item.title, item.subtitle, item.content, item.image_url, item.video_url, item.display_order, item.active, item.id))
    else:
        cursor.execute("""
            INSERT INTO homepage_blocks (block_type, title, subtitle, content, image_url, video_url, display_order, active)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (item.block_type, item.title, item.subtitle, item.content, item.image_url, item.video_url, item.display_order, item.active))
    db.commit()
    return {"status": "success", "id": cursor.lastrowid if not item.id else item.id}

@api_router.delete("/cms/homepage/{id}")
async def delete_homepage_block(id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM homepage_blocks WHERE id=?", (id,))
    db.commit()
    return {"status": "success"}

# Advisor Endpoints
@api_router.get("/advisors")
async def get_advisors():
    """Returns the static advisors list."""
    return STATIC_ADVISORS

@api_router.get("/advisors/{slug}")
async def get_advisor_by_slug(slug: str, db: sqlite3.Connection = Depends(get_db)):
    # Check static advisors first
    static_advisor = next((a for a in STATIC_ADVISORS if a['slug'] == slug), None)
    if static_advisor:
        # For static advisors, we just return the data (they might have no listings in DB yet)
        advisor = {**static_advisor}
        # Attempt to fetch listings anyway
        cursor = db.cursor()
        cursor.execute("SELECT * FROM listings WHERE advisor_id = ? AND status='published'", (advisor['id'],))
        advisor['listings'] = [dict(r) for r in cursor.fetchall()]
        return advisor

    cursor = db.cursor()
    cursor.execute("SELECT * FROM advisors WHERE slug = ?", (slug,))
    row = cursor.fetchone()
    if not row:
        raise HTTPException(status_code=404, detail="Advisor not found")
    
    advisor = dict(row)
    
    if not advisor.get('isActive'):
        # Return restricted data if inactive
        return {"name": advisor['fullName'], "isActive": False, "status": "Advisor not available"}

    # Also fetch this advisor's listings (PUBLIC: only published)
    cursor.execute("SELECT * FROM listings WHERE advisor_id = ? AND status='published'", (advisor['id'],))
    advisor['listings'] = [dict(r) for r in cursor.fetchall()]
    
    advisor['name'] = advisor.get('fullName', '')
    return advisor

@api_router.get("/advisors/{id}/listings")
async def get_advisor_listings(id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("SELECT * FROM listings WHERE advisor_id = ?", (id,))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

@api_router.post("/advisors")
async def save_advisor(item: Advisor, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        logger.info(f"Saving advisor: {item.name}")
    
        # Slug generation if missing
        if not item.slug:
            import re
            base_slug = item.name.lower().replace(" ", "-") if item.name else "advisor"
            base_slug = re.sub(r'[^\w\-]', '', base_slug)
            if not base_slug: base_slug = "advisor"
            slug = base_slug
            counter = 1
            while True:
                cursor.execute("SELECT id FROM advisors WHERE slug = ? AND id != ?", (slug, item.id or -1))
                if not cursor.fetchone():
                    break
                counter += 1
                slug = f"{base_slug}-{counter}"
            item.slug = slug

        if item.id:
            cursor.execute("""
                UPDATE advisors SET 
                    fullName=?, slug=?, title_tr=?, title_en=?, email=?, phone=?, 
                    whatsappPhone=?, portraitUrl=?, coverImageUrl=?, bioRichTextTR=?, bioRichTextEN=?, 
                    languages=?, regions=?, specialties=?, socialLinks=?, isActive=?
                WHERE id=?
            """, (
                item.name, item.slug, item.title_tr, item.title_en, item.email, item.phone,
                item.whatsappPhone, item.portraitUrl, item.coverImageUrl, item.bioRichTextTR, item.bioRichTextEN,
                item.languages, item.regions, item.specialties, item.socialLinks, item.isActive, item.id
            ))
        else:
            cursor.execute("""
                INSERT INTO advisors (
                    fullName, slug, title_tr, title_en, email, phone, 
                    whatsappPhone, portraitUrl, coverImageUrl, bioRichTextTR, bioRichTextEN, 
                    languages, regions, specialties, socialLinks, isActive
                )
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                item.name, item.slug, item.title_tr, item.title_en, item.email, item.phone,
                item.whatsappPhone, item.portraitUrl, item.coverImageUrl, item.bioRichTextTR, item.bioRichTextEN,
                item.languages, item.regions, item.specialties, item.socialLinks, item.isActive
            ))
        db.commit()
        return {"status": "success", "id": cursor.lastrowid if not item.id else item.id}
    except Exception as e:
        logger.error(f"Error saving advisor: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

@api_router.delete("/advisors/{id}")
async def delete_advisor(id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM advisors WHERE id=?", (id,))
    db.commit()
    return {"status": "success"}

if __name__ == "__main__":
    import uvicorn
    # Seed initial CMS pages if they don't exist
    with sqlite3.connect(DB_PATH) as conn:
        seed_initial_pages(conn)
    port = int(os.environ.get('PORT', 5001))
    uvicorn.run("server:app", host="0.0.0.0", port=port, reload=True)
# ============================================
# CMS PAGES WITH BLOCKS SYSTEM
# ============================================

class PageBlock(BaseModel):
    id: Optional[int] = None
    page_id: int
    block_type: str  # HERO, TEXT_SECTION, IMAGE_TEXT, QUOTE, CTA_STRIP, CONTACT_FORM
    block_data: Optional[str] = "{}"
    sort_order: int = 0
    active: bool = True

class CMSPage(BaseModel):
    id: Optional[int] = None
    title: str
    slug: str
    category: str = "general"  # general, viewing-trip, services, etc.
    status: str = "published"  # draft, published
    hero_image: Optional[str] = ""
    hero_title: Optional[str] = ""
    hero_subtitle: Optional[str] = ""
    seo_title: Optional[str] = ""
    seo_description: Optional[str] = ""
    sort_order: int = 0
    blocks: Optional[List[dict]] = []

# Get all CMS pages (with optional category filter)
@api_router.get("/cms-blocks/pages")
async def get_cms_pages_list(category: Optional[str] = None, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    if category:
        cursor.execute("SELECT * FROM pages WHERE category = ? AND active = 1 ORDER BY sort_order ASC", (category,))
    else:
        cursor.execute("SELECT * FROM pages WHERE active = 1 ORDER BY sort_order ASC")
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

# Get single CMS page with blocks
@api_router.get("/cms-blocks/page/{slug}")
async def get_cms_page_full(slug: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    
    # Get page
    cursor.execute("SELECT * FROM pages WHERE slug = ?", (slug,))
    page_row = cursor.fetchone()
    if not page_row:
        raise HTTPException(status_code=404, detail="Page not found")
    
    page = dict(page_row)
    
    # Get blocks for this page
    cursor.execute("""
        SELECT * FROM page_blocks 
        WHERE page_id = ? AND active = 1 
        ORDER BY sort_order ASC
    """, (page['id'],))
    blocks = [dict(row) for row in cursor.fetchall()]
    
    # Parse block_data JSON
    for block in blocks:
        try:
            block['block_data'] = json.loads(block.get('block_data', '{}'))
        except:
            block['block_data'] = {}
    
    page['blocks'] = blocks
    return page

# Save CMS page with blocks
@api_router.post("/cms-blocks/page")
async def save_cms_page_full(page_data: dict, db: sqlite3.Connection = Depends(get_db)):
    try:
        cursor = db.cursor()
        
        page_id = page_data.get('id')
        blocks = page_data.get('blocks', [])
        
        # Generate slug if not provided
        slug = page_data.get('slug', '')
        if not slug and page_data.get('title'):
            slug = page_data['title'].lower().replace(' ', '-').replace('/', '-')
            import re
            slug = re.sub(r'[^a-z0-9-]', '', slug)
        
        if page_id:
            # Update existing page
            cursor.execute("""
                UPDATE pages SET 
                    title = ?, slug = ?, category = ?, status = ?,
                    hero_image = ?, hero_title = ?, hero_subtitle = ?,
                    seo_title = ?, seo_description = ?, sort_order = ?,
                    updated_at = CURRENT_TIMESTAMP
                WHERE id = ?
            """, (
                page_data.get('title', ''),
                slug,
                page_data.get('category', 'general'),
                page_data.get('status', 'published'),
                page_data.get('hero_image', ''),
                page_data.get('hero_title', ''),
                page_data.get('hero_subtitle', ''),
                page_data.get('seo_title', ''),
                page_data.get('seo_description', ''),
                page_data.get('sort_order', 0),
                page_id
            ))
        else:
            # Insert new page
            cursor.execute("""
                INSERT INTO pages (title, slug, category, status, hero_image, hero_title, hero_subtitle, seo_title, seo_description, sort_order, active)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1)
            """, (
                page_data.get('title', ''),
                slug,
                page_data.get('category', 'general'),
                page_data.get('status', 'published'),
                page_data.get('hero_image', ''),
                page_data.get('hero_title', ''),
                page_data.get('hero_subtitle', ''),
                page_data.get('seo_title', ''),
                page_data.get('seo_description', ''),
                page_data.get('sort_order', 0)
            ))
            page_id = cursor.lastrowid
        
        # Delete existing blocks and re-insert
        cursor.execute("DELETE FROM page_blocks WHERE page_id = ?", (page_id,))
        
        # Insert blocks
        for idx, block in enumerate(blocks):
            block_data = block.get('block_data', {})
            if isinstance(block_data, dict):
                block_data = json.dumps(block_data)
            
            cursor.execute("""
                INSERT INTO page_blocks (page_id, block_type, block_data, sort_order, active)
                VALUES (?, ?, ?, ?, 1)
            """, (
                page_id,
                block.get('block_type', 'TEXT_SECTION'),
                block_data,
                idx
            ))
        
        db.commit()
        return {"status": "success", "id": page_id, "slug": slug}
    except Exception as e:
        logger.error(f"Error saving CMS page: {str(e)}")
        import traceback
        logger.error(traceback.format_exc())
        raise HTTPException(status_code=500, detail=str(e))

# Delete CMS page
@api_router.delete("/cms/pages/full/{page_id}")
async def delete_cms_page_full(page_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM page_blocks WHERE page_id = ?", (page_id,))
    cursor.execute("DELETE FROM pages WHERE id = ?", (page_id,))
    db.commit()
    return {"status": "success"}

# Get pages by category (for menus)
@api_router.get("/cms-blocks/pages/category/{category}")
async def get_pages_by_category(category: str, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        SELECT id, title, slug, hero_title, sort_order 
        FROM pages 
        WHERE category = ? AND status = 'published' AND active = 1 
        ORDER BY sort_order ASC
    """, (category,))
    rows = cursor.fetchall()
    return [dict(row) for row in rows]

# Block CRUD Endpoints
@api_router.get("/cms-blocks/pages/{page_id}/blocks")
async def get_page_blocks(page_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("""
        SELECT id, page_id, block_type, block_data, sort_order, active 
        FROM page_blocks 
        WHERE page_id = ? 
        ORDER BY sort_order ASC
    """, (page_id,))
    rows = cursor.fetchall()
    blocks = []
    for row in rows:
        block = dict(row)
        try:
            block['data'] = json.loads(block.pop('block_data', '{}'))
        except:
            block['data'] = {}
        blocks.append(block)
    return blocks

@api_router.post("/cms-blocks/pages/{page_id}/blocks")
async def create_page_block(page_id: int, request: Request, db: sqlite3.Connection = Depends(get_db)):
    data = await request.json()
    cursor = db.cursor()
    
    # Get max sort_order
    cursor.execute("SELECT COALESCE(MAX(sort_order), 0) + 1 FROM page_blocks WHERE page_id = ?", (page_id,))
    sort_order = cursor.fetchone()[0]
    
    cursor.execute("""
        INSERT INTO page_blocks (page_id, block_type, block_data, sort_order, active)
        VALUES (?, ?, ?, ?, ?)
    """, (page_id, data.get('block_type'), json.dumps(data.get('data', {})), sort_order, 1))
    db.commit()
    return {"id": cursor.lastrowid, "message": "Block created"}

@api_router.put("/cms-blocks/blocks/{block_id}")
async def update_block(block_id: int, request: Request, db: sqlite3.Connection = Depends(get_db)):
    data = await request.json()
    cursor = db.cursor()
    
    updates = []
    params = []
    
    if 'block_type' in data:
        updates.append("block_type = ?")
        params.append(data['block_type'])
    if 'data' in data:
        updates.append("block_data = ?")
        params.append(json.dumps(data['data']))
    if 'sort_order' in data:
        updates.append("sort_order = ?")
        params.append(data['sort_order'])
    if 'active' in data:
        updates.append("active = ?")
        params.append(1 if data['active'] else 0)
    
    if updates:
        params.append(block_id)
        cursor.execute(f"UPDATE page_blocks SET {', '.join(updates)} WHERE id = ?", params)
        db.commit()
    
    return {"message": "Block updated"}

@api_router.delete("/cms-blocks/blocks/{block_id}")
async def delete_block(block_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    cursor.execute("DELETE FROM page_blocks WHERE id = ?", (block_id,))
    db.commit()
    return {"message": "Block deleted"}

@api_router.put("/cms-blocks/pages/{page_id}/blocks/reorder")
async def reorder_blocks(page_id: int, request: Request, db: sqlite3.Connection = Depends(get_db)):
    data = await request.json()
    block_ids = data.get('block_ids', [])
    cursor = db.cursor()
    
    for idx, block_id in enumerate(block_ids):
        cursor.execute("UPDATE page_blocks SET sort_order = ? WHERE id = ? AND page_id = ?", (idx, block_id, page_id))
    
    db.commit()
    return {"message": "Blocks reordered"}

@api_router.delete("/cms-blocks/pages/{page_id}")
async def delete_cms_page(page_id: int, db: sqlite3.Connection = Depends(get_db)):
    cursor = db.cursor()
    # Delete blocks first
    cursor.execute("DELETE FROM page_blocks WHERE page_id = ?", (page_id,))
    # Delete page
    cursor.execute("DELETE FROM pages WHERE id = ?", (page_id,))
    db.commit()
    return {"message": "Page and blocks deleted"}



app.include_router(api_router)

