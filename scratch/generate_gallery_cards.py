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

# Metallic Chroma duotone color themes: Icy Titanium, Electric Indigo, Chrome Cyan, Violet Cobalt
cards_data = [
    {"num": "1,340", "label": "Active Scholars", "filename": "card1.png", "icon": "cap", "c1": (56, 189, 248), "c2": (168, 85, 247)},
    {"num": "56m", "label": "Avg Study Session", "filename": "card2.png", "icon": "clock", "c1": (192, 132, 252), "c2": (56, 189, 248)},
    {"num": "88.4%", "label": "Accuracy Rate", "filename": "card3.png", "icon": "target", "c1": (232, 121, 249), "c2": (129, 140, 248)},
    {"num": "22.4K", "label": "Network Visits", "filename": "card4.png", "icon": "eye", "c1": (34, 211, 238), "c2": (99, 102, 241)},
    {"num": "50", "label": "US States Active", "filename": "card5.png", "icon": "pin", "c1": (147, 197, 253), "c2": (192, 132, 252)},
    {"num": "100%", "label": "Free & Open Access", "filename": "card6.png", "icon": "lock", "c1": (52, 211, 153), "c2": (56, 189, 248)}
]

for data in cards_data:
    # Sleek dark graphite/obsidian background
    img = Image.new("RGBA", (width, height), (7, 8, 18, 255))
    draw = ImageDraw.Draw(img)
    
    c1, c2 = data["c1"], data["c2"]
    
    # Outer Metallic Chrome Glass Border
    for i in range(width):
        t = i / float(width)
        r = int(c1[0] * (1 - t) + c2[0] * t)
        g = int(c1[1] * (1 - t) + c2[1] * t)
        b = int(c1[2] * (1 - t) + c2[2] * t)
        for bw in range(2):
            img.putpixel((i, 15 + bw), (r, g, b, 190))
            img.putpixel((i, height - 16 - bw), (r, g, b, 190))
            
    for j in range(height):
        t = j / float(height)
        r = int(c1[0] * (1 - t) + c2[0] * t)
        g = int(c1[1] * (1 - t) + c2[1] * t)
        b = int(c1[2] * (1 - t) + c2[2] * t)
        for bw in range(2):
            img.putpixel((15 + bw, j), (r, g, b, 190))
            img.putpixel((width - 16 - bw, j), (r, g, b, 190))
            
    # Draw Sleek Metallic Chroma Pixel-Art Icon
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
                
                # Smooth metallic chroma transition across icon matrix
                t_pixel = (c_idx + r_idx * 0.8) / 16.0
                r_pix = int(c1[0] * (1 - t_pixel) + c2[0] * t_pixel)
                g_pix = int(c1[1] * (1 - t_pixel) + c2[1] * t_pixel)
                b_pix = int(c1[2] * (1 - t_pixel) + c2[2] * t_pixel)
                
                for bx in range(scale):
                    for by in range(scale):
                        noise = random.uniform(0.82, 1.0)
                        red = int(min(255, r_pix * noise))
                        green = int(min(255, g_pix * noise))
                        blue = int(min(255, b_pix * noise))
                        alpha = int(random.uniform(0.82, 1.0) * 255)
                        img.putpixel((px + bx, py + by), (red, green, blue, alpha))

    # Render Typography
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
    
    draw.text(((width - w_num) // 2, 330), num_text, font=font_num, fill=(255, 255, 255, 255))
    
    # Label in metallic chroma tint
    draw.text(((width - w_lbl) // 2, 455), label_text, font=font_label, fill=(c1[0], c1[1], c1[2], 240))
    
    filepath = os.path.join("/Users/pallavipatil/AP-LABs/AP-Lab/public/images/stats", data["filename"])
    img.save(filepath, "PNG")
    print(f"Generated metallic chroma card: {filepath}")

print("All metallic chroma gallery stat cards generated successfully!")
