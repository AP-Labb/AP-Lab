import os
from PIL import Image

def make_transparent_white_logo(src_path, dst_path):
    img = Image.open(src_path).convert("RGBA")
    datas = img.getdata()
    
    newData = []
    for item in datas:
        r, g, b, a = item
        # If pixel is dark/black background (brightness < 40)
        brightness = (r + g + b) / 3.0
        if brightness < 40:
            newData.append((0, 0, 0, 0)) # Make background transparent!
        else:
            # Make the logo mark crisp white
            newData.append((255, 255, 255, a))
            
    img.putdata(newData)
    img.save(dst_path, "PNG")
    print(f"Saved transparent white logo: {dst_path}")

make_transparent_white_logo("/Users/pallavipatil/AP-LABs/AP-Lab/public/images/logos/google.png", "/Users/pallavipatil/AP-LABs/AP-Lab/public/images/logos/google.png")
make_transparent_white_logo("/Users/pallavipatil/AP-LABs/AP-Lab/public/images/logos/firebase.png", "/Users/pallavipatil/AP-LABs/AP-Lab/public/images/logos/firebase.png")
