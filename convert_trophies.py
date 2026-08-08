import os
from PIL import Image

media_map = {
    "ap-eng-lang.png": "media__1786186653699.png",
    "ap-psych.png": "media__1786186653779.png",
    "ap-ush.png": "media__1786186653806.jpg",
    "ap-stats.png": "media__1786186653852.jpg",
    "ap-biology.png": "media__1786186653860.jpg",
    "ap-chemistry.png": "media__1786187189013.jpg",
    "ap-physics-c.png": "media__1786187194820.jpg",
    "ap-csa.png": "media__1786187201954.jpg",
    "ap-calc-bc.png": "media__1786187251025.jpg",
}

brain_dir = "/Users/pallavipatil/.gemini/antigravity-ide/brain/fcfb06b4-d0aa-4f8e-a0c4-307f3df88fe8"
out_dir = "/Users/pallavipatil/AP-LABs/AP-Lab/public/images/trophies"
os.makedirs(out_dir, exist_ok=True)

for target_name, src_file in media_map.items():
    src_path = os.path.join(brain_dir, src_file)
    if not os.path.exists(src_path):
        print(f"File not found: {src_path}")
        continue
    
    img = Image.open(src_path).convert("RGBA")
    datas = list(img.getdata())
    
    new_data = []
    for item in datas:
        r, g, b, a = item
        brightness = (r + g + b) / 3.0
        if brightness < 30 and r < 40 and g < 40 and b < 40:
            new_data.append((0, 0, 0, 0))
        elif brightness < 50 and r < 58 and g < 58 and b < 58:
            alpha = int(((brightness - 30) / 20.0) * 255)
            new_data.append((r, g, b, alpha))
        else:
            new_data.append((r, g, b, a))
            
    img.putdata(new_data)
    
    bbox = img.getbbox()
    if bbox:
        img = img.crop(bbox)
        
    out_path = os.path.join(out_dir, target_name)
    img.save(out_path, "PNG")
    print(f"Successfully processed & saved: {out_path} ({img.size})")

