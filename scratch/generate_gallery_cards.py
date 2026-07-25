import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs("/Users/pallavipatil/AP-LABs/AP-Lab/public/images/stats", exist_ok=True)

cards_data = [
    {"num": "1,340", "label": "Active Scholars", "filename": "card1.png", "color1": (32, 201, 151), "color2": (56, 189, 248)},
    {"num": "56m", "label": "Avg Study Session", "filename": "card2.png", "color1": (245, 158, 11), "color2": (251, 191, 36)},
    {"num": "88.4%", "label": "Accuracy Rate", "filename": "card3.png", "color1": (164, 132, 213), "color2": (232, 121, 249)},
    {"num": "22.4K", "label": "Network Visits", "filename": "card4.png", "color1": (34, 211, 238), "color2": (129, 140, 248)},
    {"num": "50", "label": "US States Active", "filename": "card5.png", "color1": (59, 130, 246), "color2": (147, 51, 234)},
    {"num": "100%", "label": "Free & Open Access", "filename": "card6.png", "color1": (16, 185, 129), "color2": (52, 211, 153)}
]

width, height = 800, 600

for data in cards_data:
    img = Image.new("RGBA", (width, height), (7, 9, 19, 255))
    draw = ImageDraw.Draw(img)
    
    # Outer glass border box
    draw.rounded_rectangle([(20, 20), (width - 20, height - 20)], radius=32, fill=(12, 16, 32, 255), outline=data["color1"] + (180,), width=3)
    
    # Inner glow accent
    c1 = data["color1"]
    for i in range(120):
        alpha = int((1 - i / 120.0) * 45)
        draw.ellipse([(width//2 - 250 + i, height//2 - 180 + i), (width//2 + 250 - i, height//2 + 180 - i)], fill=None, outline=c1 + (alpha,))
        
    # Draw Text
    try:
        font_num = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 110)
        font_label = ImageFont.truetype("/System/Library/Fonts/Helvetica.ttc", 36)
    except:
        font_num = ImageFont.load_default()
        font_label = ImageFont.load_default()
        
    num_text = data["num"]
    label_text = data["label"].upper()
    
    # Center text
    bbox_num = draw.textbbox((0, 0), num_text, font=font_num)
    w_num = bbox_num[2] - bbox_num[0]
    h_num = bbox_num[3] - bbox_num[1]
    
    bbox_lbl = draw.textbbox((0, 0), label_text, font=font_label)
    w_lbl = bbox_lbl[2] - bbox_lbl[0]
    
    draw.text(((width - w_num) // 2, (height // 2) - 80), num_text, font=font_num, fill=(255, 255, 255, 255))
    draw.text(((width - w_lbl) // 2, (height // 2) + 60), label_text, font=font_label, fill=data["color2"] + (230,))
    
    filepath = os.path.join("/Users/pallavipatil/AP-LABs/AP-Lab/public/images/stats", data["filename"])
    img.save(filepath, "PNG")
    print(f"Generated {filepath}")

print("All gallery stat card images generated successfully!")
