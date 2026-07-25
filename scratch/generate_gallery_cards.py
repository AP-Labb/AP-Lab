import os
import math
import random
from PIL import Image, ImageDraw, ImageFont

os.makedirs("/Users/pallavipatil/AP-LABs/AP-Lab/public/images/stats", exist_ok=True)

width, height = 800, 600

PIXEL_ICONS = {
    "cap": [
        [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0],
        [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,0,0,1,0],
        [0,0,0,0,0,1,1,1,1,1,1,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    ],
    "clock": [
        [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
        [0,0,1,0,0,0,0,1,1,0,0,0,0,1,0,0],
        [0,1,0,0,0,0,0,1,1,0,0,0,0,0,1,0],
        [0,1,0,0,0,0,0,1,1,0,0,0,0,0,1,0],
        [1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1],
        [1,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1],
        [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,1,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
        [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0],
        [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
        [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0]
    ],
    "target": [
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1],
        [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0],
        [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0],
        [0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0],
        [0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0],
        [1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0],
        [0,1,1,1,0,0,0,1,1,0,0,0,0,0,0,0],
        [0,0,1,1,1,0,1,1,0,0,0,0,0,0,0,0],
        [0,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0],
        [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0]
    ],
    "eye": [
        [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
        [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0],
        [0,1,0,0,0,0,1,1,1,1,0,0,0,0,1,0],
        [1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1],
        [1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
        [1,0,0,0,0,1,1,0,0,1,1,0,0,0,0,1],
        [1,0,0,0,0,1,1,1,1,1,1,0,0,0,0,1],
        [0,1,0,0,0,0,1,1,1,1,0,0,0,0,1,0],
        [0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0],
        [0,0,0,1,1,0,0,0,0,0,0,1,1,0,0,0],
        [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0]
    ],
    "pin": [
        [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0],
        [0,1,1,1,0,0,1,1,1,1,0,0,1,1,1,0],
        [0,1,1,1,0,0,1,1,1,1,0,0,1,1,1,0],
        [0,1,1,1,0,0,0,0,0,0,0,0,1,1,1,0],
        [0,0,1,1,1,0,0,0,0,0,0,1,1,1,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0],
        [0,0,0,0,1,1,1,1,1,1,1,1,0,0,0,0],
        [0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0]
    ],
    "lock": [
        [0,0,0,0,0,1,1,1,1,1,0,0,0,0,0,0],
        [0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,1,1,0,0,1,1,0,1,0,0,0,0,0],
        [0,0,0,1,1,0,0,1,1,0,1,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0],
        [0,0,0,1,1,1,1,1,1,1,1,0,0,0,0,0]
    ]
}

cards_data = [
    {"num": "1,340", "label": "Active Scholars", "filename": "card1.png", "icon": "cap", "hue_shift": 0},
    {"num": "56m", "label": "Avg Study Session", "filename": "card2.png", "icon": "clock", "hue_shift": 60},
    {"num": "88.4%", "label": "Accuracy Rate", "filename": "card3.png", "icon": "target", "hue_shift": 120},
    {"num": "22.4K", "label": "Network Visits", "filename": "card4.png", "icon": "eye", "hue_shift": 180},
    {"num": "50", "label": "US States Active", "filename": "card5.png", "icon": "pin", "hue_shift": 240},
    {"num": "100%", "label": "Free & Open Access", "filename": "card6.png", "icon": "lock", "hue_shift": 300}
]

def hsl_to_rgb(h, s, l):
    c = (1 - abs(2 * l - 1)) * s
    x = c * (1 - abs((h / 60.0) % 2 - 1))
    m = l - c / 2.0
    if 0 <= h < 60:
        r, g, b = c, x, 0
    elif 60 <= h < 120:
        r, g, b = x, c, 0
    elif 120 <= h < 180:
        r, g, b = 0, c, x
    elif 180 <= h < 240:
        r, g, b = 0, x, c
    elif 240 <= h < 300:
        r, g, b = x, 0, c
    else:
        r, g, b = c, 0, x
    return (int((r + m) * 255), int((g + m) * 255), int((b + m) * 255))

for data in cards_data:
    # Deep obsidian navy/purple base background matching profile card
    img = Image.new("RGBA", (width, height), (11, 10, 24, 255))
    draw = ImageDraw.Draw(img)
    
    hue_offset = data["hue_shift"]
    
    # Outer Rainbow Chroma Glass Border
    for i in range(width):
        border_hue = (hue_offset + (i / float(width)) * 360) % 360
        r_b, g_b, b_b = hsl_to_rgb(border_hue, 0.8, 0.65)
        # Top and bottom borders
        for bw in range(2):
            img.putpixel((i, 15 + bw), (r_b, g_b, b_b, 180))
            img.putpixel((i, height - 16 - bw), (r_b, g_b, b_b, 180))
            
    for j in range(height):
        border_hue = (hue_offset + (j / float(height)) * 360) % 360
        r_b, g_b, b_b = hsl_to_rgb(border_hue, 0.8, 0.65)
        for bw in range(2):
            img.putpixel((15 + bw, j), (r_b, g_b, b_b, 180))
            img.putpixel((width - 16 - bw, j), (r_b, g_b, b_b, 180))
            
    # Draw Holographic Rainbow Chroma Pixel-Art Icon
    icon_matrix = PIXEL_ICONS[data["icon"]]
    scale = 14
    icon_w = len(icon_matrix[0]) * scale
    icon_h = len(icon_matrix) * scale
    start_x = (width - icon_w) // 2
    start_y = 65
    
    for r_idx, row in enumerate(icon_matrix):
        for c_idx, val in enumerate(row):
            if val == 1:
                px = start_x + c_idx * scale
                py = start_y + r_idx * scale
                
                # Dynamic multi-tonal rainbow chroma color per pixel position
                px_hue = (hue_offset + c_idx * 18 + r_idx * 22) % 360
                r_pix, g_pix, b_pix = hsl_to_rgb(px_hue, 0.85, 0.72)
                
                for bx in range(scale):
                    for by in range(scale):
                        noise = random.uniform(0.78, 1.0)
                        red = int(min(255, r_pix * noise))
                        green = int(min(255, g_pix * noise))
                        blue = int(min(255, b_pix * noise))
                        alpha = int(random.uniform(0.8, 1.0) * 255)
                        img.putpixel((px + bx, py + by), (red, green, blue, alpha))

    # Render Fonts
    try:
        font_num = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 100)
        font_label = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 32)
    except:
        font_num = ImageFont.load_default()
        font_label = ImageFont.load_default()
        
    num_text = data["num"]
    label_text = data["label"].upper()
    
    bbox_num = draw.textbbox((0, 0), num_text, font=font_num)
    w_num = bbox_num[2] - bbox_num[0]
    
    bbox_lbl = draw.textbbox((0, 0), label_text, font=font_label)
    w_lbl = bbox_lbl[2] - bbox_lbl[0]
    
    # Text Placement
    draw.text(((width - w_num) // 2, 330), num_text, font=font_num, fill=(255, 255, 255, 255))
    
    # Label in Chroma accent color
    lbl_r, lbl_g, lbl_b = hsl_to_rgb((hue_offset + 120) % 360, 0.9, 0.75)
    draw.text(((width - w_lbl) // 2, 455), label_text, font=font_label, fill=(lbl_r, lbl_g, lbl_b, 240))
    
    filepath = os.path.join("/Users/pallavipatil/AP-LABs/AP-Lab/public/images/stats", data["filename"])
    img.save(filepath, "PNG")
    print(f"Generated rainbow chroma card: {filepath}")

print("All rainbow chroma gallery stat cards generated successfully!")
