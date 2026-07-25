import os
import random
from PIL import Image, ImageDraw, ImageFont

os.makedirs("/Users/pallavipatil/AP-LABs/AP-Lab/public/images/stats", exist_ok=True)

width, height = 800, 600

# 16x16 Pixel Art Matrices for each statistic icon
PIXEL_ICONS = {
    # Pixel Graduation Cap / Scholar Hat
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
    # Pixel Clock / Timer
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
    # Pixel Target / Accuracy Check
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
    # Pixel Eye (for Network Views)
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
    # Pixel Map Pin
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
    # Pixel Unlocked Lock
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
    {
        "num": "1,340",
        "label": "Active Scholars",
        "filename": "card1.png",
        "icon": "cap",
        "bg_color": (5, 8, 16),
        "glow_color": (32, 201, 151),
        "accent_color": (56, 189, 248)
    },
    {
        "num": "56m",
        "label": "Avg Study Session",
        "filename": "card2.png",
        "icon": "clock",
        "bg_color": (12, 9, 5),
        "glow_color": (245, 158, 11),
        "accent_color": (251, 191, 36)
    },
    {
        "num": "88.4%",
        "label": "Accuracy Rate",
        "filename": "card3.png",
        "icon": "target",
        "bg_color": (12, 6, 18),
        "glow_color": (164, 132, 213),
        "accent_color": (232, 121, 249)
    },
    {
        "num": "22.4K",
        "label": "Network Visits",
        "filename": "card4.png",
        "icon": "eye",
        "bg_color": (4, 12, 18),
        "glow_color": (34, 211, 238),
        "accent_color": (56, 189, 248)
    },
    {
        "num": "50",
        "label": "US States Active",
        "filename": "card5.png",
        "icon": "pin",
        "bg_color": (5, 10, 22),
        "glow_color": (59, 130, 246),
        "accent_color": (147, 197, 253)
    },
    {
        "num": "100%",
        "label": "Free & Open Access",
        "filename": "card6.png",
        "icon": "lock",
        "bg_color": (5, 14, 12),
        "glow_color": (16, 185, 129),
        "accent_color": (52, 211, 153)
    }
]

for data in cards_data:
    bg = data["bg_color"]
    glow = data["glow_color"]
    acc = data["accent_color"]
    
    img = Image.new("RGBA", (width, height), (bg[0], bg[1], bg[2], 255))
    draw = ImageDraw.Draw(img)
    
    # Dark glass container border
    draw.rounded_rectangle([(15, 15), (width - 15, height - 15)], radius=32, fill=(bg[0]+4, bg[1]+4, bg[2]+6, 255), outline=(glow[0], glow[1], glow[2], 90), width=2)
    
    # Draw Pixel Art Icon in background
    icon_matrix = PIXEL_ICONS[data["icon"]]
    scale = 14  # Size of each pixel block
    
    icon_w = len(icon_matrix[0]) * scale
    icon_h = len(icon_matrix) * scale
    start_x = (width - icon_w) // 2
    start_y = 70  # Place icon at top center
    
    for r_idx, row in enumerate(icon_matrix):
        for c_idx, val in enumerate(row):
            if val == 1:
                px = start_x + c_idx * scale
                py = start_y + r_idx * scale
                
                # Render glowing dither pixel
                for bx in range(scale):
                    for by in range(scale):
                        noise = random.uniform(0.8, 1.0)
                        red = int(min(255, acc[0] * noise))
                        green = int(min(255, acc[1] * noise))
                        blue = int(min(255, acc[2] * noise))
                        alpha = int(random.uniform(0.7, 0.95) * 255)
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
    
    # Calculate Text Dimensions
    bbox_num = draw.textbbox((0, 0), num_text, font=font_num)
    w_num = bbox_num[2] - bbox_num[0]
    
    bbox_lbl = draw.textbbox((0, 0), label_text, font=font_label)
    w_lbl = bbox_lbl[2] - bbox_lbl[0]
    
    # Text Placement
    draw.text(((width - w_num) // 2, 330), num_text, font=font_num, fill=(255, 255, 255, 255))
    draw.text(((width - w_lbl) // 2, 455), label_text, font=font_label, fill=(acc[0], acc[1], acc[2], 230))
    
    filepath = os.path.join("/Users/pallavipatil/AP-LABs/AP-Lab/public/images/stats", data["filename"])
    img.save(filepath, "PNG")
    print(f"Generated dark pixel-art card: {filepath}")

print("All dark pixel-art gallery stat cards generated successfully!")
